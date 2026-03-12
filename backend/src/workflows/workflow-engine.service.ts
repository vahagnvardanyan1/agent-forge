/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/require-await */
import { Injectable, Logger } from '@nestjs/common';
import { Annotation, StateGraph, END, START } from '@langchain/langgraph';
import { AiProvidersService } from '../ai-providers/ai-providers.service';
import { KnowledgeService } from '../knowledge/knowledge.service';

interface WorkflowNode {
  id: string;
  type: string;
  config?: Record<string, unknown>;
}

interface WorkflowEdge {
  from: string;
  to: string;
  condition?: string;
}

interface NodeResult {
  nodeId: string;
  output: Record<string, unknown>;
  durationMs: number;
}

export interface WorkflowExecutionResult {
  executionId: string;
  status: string;
  nodeResults: NodeResult[];
  totalDurationMs: number;
}

const WorkflowState = Annotation.Root({
  input: Annotation<string>(),
  currentOutput: Annotation<string>({
    reducer: (_curr, update) => update,
    default: () => '',
  }),
  nodeResults: Annotation<NodeResult[]>({
    reducer: (curr, update) => [...curr, ...update],
    default: () => [],
  }),
});

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  constructor(
    private readonly aiProviders: AiProvidersService,
    private readonly knowledgeService: KnowledgeService,
  ) {}

  // Fix #16: Removed unused `_variables` parameter
  async executeWorkflow(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    input: string,
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    const executionId = `wf_exec_${Date.now().toString(36)}`;
    this.logger.log(
      `Starting workflow execution ${executionId} with ${nodes.length} nodes`,
    );

    if (nodes.length === 0) {
      return {
        executionId,
        status: 'COMPLETED',
        nodeResults: [],
        totalDurationMs: Date.now() - startTime,
      };
    }

    try {
      const builder = new StateGraph(WorkflowState) as any;

      for (const node of nodes) {
        builder.addNode(node.id, async (state: typeof WorkflowState.State) => {
          const nodeStart = Date.now();
          const nodeInput = state.currentOutput || state.input;
          const output = await this.executeNode(node, nodeInput);
          return {
            currentOutput: output.result as string,
            nodeResults: [
              {
                nodeId: node.id,
                output,
                durationMs: Date.now() - nodeStart,
              },
            ],
          };
        });
      }

      const inDegree = new Map<string, number>();
      const outEdges = new Map<string, string[]>();
      for (const node of nodes) {
        inDegree.set(node.id, 0);
        outEdges.set(node.id, []);
      }
      for (const edge of edges) {
        inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
        outEdges.get(edge.from)?.push(edge.to);
      }

      const startNodes = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0);
      const terminalNodes = nodes.filter(
        (n) => (outEdges.get(n.id) ?? []).length === 0,
      );

      for (const sn of startNodes) {
        builder.addEdge(START, sn.id);
      }

      for (const edge of edges) {
        const node = nodes.find((n) => n.id === edge.from);
        if (node?.type === 'condition' && edge.condition) {
          const fromEdges = edges.filter((e) => e.from === edge.from);
          if (fromEdges.length > 1) {
            const conditionTargets: Record<string, string> = {};
            for (const fe of fromEdges) {
              conditionTargets[fe.condition ?? fe.to] = fe.to;
            }
            try {
              builder.addConditionalEdges(
                edge.from,
                async (state: typeof WorkflowState.State) => {
                  const lastResult =
                    state.nodeResults[state.nodeResults.length - 1];
                  const decision = (lastResult?.output?.result as string) ?? '';
                  return conditionTargets[decision]
                    ? decision
                    : Object.keys(conditionTargets)[0];
                },
                conditionTargets,
              );
            } catch {
              // Conditional edges already added for this node
            }
          } else {
            builder.addEdge(edge.from, edge.to);
          }
        } else {
          builder.addEdge(edge.from, edge.to);
        }
      }

      for (const tn of terminalNodes) {
        builder.addEdge(tn.id, END);
      }

      const graph = builder.compile();
      const result = await graph.invoke(
        { input, currentOutput: '', nodeResults: [] },
        { recursionLimit: 50 },
      );

      return {
        executionId,
        status: 'COMPLETED',
        nodeResults: result.nodeResults,
        totalDurationMs: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error(
        `Workflow execution failed: ${(error as Error).message}`,
      );

      const fallbackResults = await this.executeFallback(nodes, edges, input);
      return {
        executionId,
        status: 'COMPLETED',
        nodeResults: fallbackResults,
        totalDurationMs: Date.now() - startTime,
      };
    }
  }

  private async executeNode(
    node: WorkflowNode,
    input: string,
  ): Promise<Record<string, unknown>> {
    switch (node.type) {
      case 'llm': {
        const provider = (node.config?.provider as string) ?? 'openai';
        const model = this.aiProviders.getProvider(provider).getChatModel({
          model: node.config?.model as string,
          temperature: node.config?.temperature as number,
        });
        const response = await model.invoke(input);
        return {
          result:
            typeof response.content === 'string'
              ? response.content
              : JSON.stringify(response.content),
        };
      }
      case 'condition': {
        const conditionExpr = (node.config?.condition as string) ?? '';
        const lowerInput = input.toLowerCase();
        if (conditionExpr && lowerInput.includes(conditionExpr.toLowerCase())) {
          return { result: 'true' };
        }
        return { result: 'false' };
      }
      case 'knowledge': {
        const kbId = node.config?.knowledgeBaseId as string;
        if (kbId) {
          const results = await this.knowledgeService.query(kbId, {
            query: input,
            topK: (node.config?.topK as number) ?? 5,
          });
          return { result: JSON.stringify(results.matches ?? []) };
        }
        return { result: 'No knowledge base configured' };
      }
      case 'tool': {
        return {
          result: `Tool node ${node.id} executed with input: ${input.slice(0, 100)}`,
        };
      }
      default: {
        return {
          result: `Processed by ${node.type} node: ${input.slice(0, 100)}`,
        };
      }
    }
  }

  private async executeFallback(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    input: string,
  ): Promise<NodeResult[]> {
    const sorted = this.topologicalSort(nodes, edges);
    const results: NodeResult[] = [];
    let currentInput = input;

    for (const node of sorted) {
      const nodeStart = Date.now();
      const output = await this.executeNode(node, currentInput);
      currentInput = (output.result as string) ?? currentInput;
      results.push({
        nodeId: node.id,
        output,
        durationMs: Date.now() - nodeStart,
      });
    }

    return results;
  }

  private topologicalSort(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
  ): WorkflowNode[] {
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    for (const node of nodes) {
      inDegree.set(node.id, 0);
      adjacency.set(node.id, []);
    }

    for (const edge of edges) {
      inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
      adjacency.get(edge.from)?.push(edge.to);
    }

    const queue = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0);
    const sorted: WorkflowNode[] = [];
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    while (queue.length > 0) {
      const current = queue.shift()!;
      sorted.push(current);

      for (const neighbor of adjacency.get(current.id) ?? []) {
        const newDegree = (inDegree.get(neighbor) ?? 1) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) {
          const neighborNode = nodeMap.get(neighbor);
          if (neighborNode) queue.push(neighborNode);
        }
      }
    }

    return sorted;
  }
}

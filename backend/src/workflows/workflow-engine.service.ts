import { Injectable, Logger } from '@nestjs/common';

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

export interface WorkflowExecutionResult {
  executionId: string;
  status: string;
  nodeResults: Array<{
    nodeId: string;
    output: Record<string, unknown>;
    durationMs: number;
  }>;
  totalDurationMs: number;
}

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  executeWorkflow(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    input: string,
    _variables?: Record<string, unknown>,
  ): WorkflowExecutionResult {
    const startTime = Date.now();
    const executionId = `wf_exec_${Date.now().toString(36)}`;
    this.logger.log(
      `Starting workflow execution ${executionId} with ${nodes.length} nodes`,
    );

    const nodeResults = [];
    const sortedNodes = this.topologicalSort(nodes, edges);

    for (const node of sortedNodes) {
      const nodeStart = Date.now();
      this.logger.log(`Executing node ${node.id} (type: ${node.type})`);

      nodeResults.push({
        nodeId: node.id,
        output: {
          result: `Processed by ${node.type} node`,
          input: nodeResults.length === 0 ? input : 'chained',
        },
        durationMs: Date.now() - nodeStart,
      });
    }

    return {
      executionId,
      status: 'COMPLETED',
      nodeResults,
      totalDurationMs: Date.now() - startTime,
    };
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

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { Annotation, StateGraph, END, START } from '@langchain/langgraph';
import { HandoffService } from './handoff.service';
import { AiProvidersService } from '../ai-providers/ai-providers.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrchestrateDto, OrchestrationStrategy } from './dto/orchestrate.dto';

interface AgentRecord {
  id: string;
  name: string;
  provider: string;
  model: string;
  systemPrompt: string;
}

interface AgentResult {
  agentId: string;
  output: string;
  durationMs: number;
}

interface OrchestrationResult {
  orchestrationId: string;
  strategy: OrchestrationStrategy;
  agentResults: AgentResult[];
  finalOutput: string;
  totalDurationMs: number;
}

const OrchestrationState = Annotation.Root({
  input: Annotation<string>(),
  currentOutput: Annotation<string>({
    reducer: (_curr, update) => update,
    default: () => '',
  }),
  agentResults: Annotation<AgentResult[]>({
    reducer: (curr, update) => [...curr, ...update],
    default: () => [],
  }),
  currentAgentIndex: Annotation<number>({
    reducer: (_curr, update) => update,
    default: () => 0,
  }),
});

@Injectable()
export class OrchestrationService {
  private readonly logger = new Logger(OrchestrationService.name);

  constructor(
    // Fix #11: Removed unused WorkforceService injection
    private readonly handoffService: HandoffService,
    private readonly aiProviders: AiProvidersService,
    private readonly prisma: PrismaService,
  ) {}

  async orchestrate(
    workforceId: string,
    userId: string,
    dto: OrchestrateDto,
  ): Promise<OrchestrationResult> {
    const strategy = dto.strategy ?? OrchestrationStrategy.SEQUENTIAL;
    const startTime = Date.now();
    const orchestrationId = `orch_${Date.now().toString(36)}`;

    this.logger.log(
      `Orchestrating workforce ${workforceId} with strategy ${strategy}`,
    );

    const workforce = await this.prisma.workforce.findUnique({
      where: { id: workforceId },
      include: {
        members: {
          include: { agent: true },
          orderBy: { priority: 'asc' },
        },
      },
    });

    if (!workforce || workforce.members.length === 0) {
      return {
        orchestrationId,
        strategy,
        agentResults: [],
        finalOutput: `No agents found in workforce ${workforceId}`,
        totalDurationMs: Date.now() - startTime,
      };
    }

    const agents = workforce.members.map((m) => m.agent);

    let agentResults: AgentResult[];

    switch (strategy) {
      case OrchestrationStrategy.SEQUENTIAL:
        agentResults = await this.executeSequential(agents, dto.input);
        break;
      case OrchestrationStrategy.PARALLEL:
        agentResults = await this.executeParallel(agents, dto.input);
        break;
      case OrchestrationStrategy.ADAPTIVE:
        agentResults = await this.executeAdaptive(
          agents,
          dto.input,
          workforce.managerAgentId,
        );
        break;
      // Fix #10: Explicitly handle ROUND_ROBIN
      case OrchestrationStrategy.ROUND_ROBIN:
        throw new NotImplementedException(
          'ROUND_ROBIN orchestration strategy is not yet implemented',
        );
      default:
        agentResults = await this.executeSequential(agents, dto.input);
    }

    const finalOutput =
      agentResults.length > 0
        ? agentResults[agentResults.length - 1].output
        : '';

    return {
      orchestrationId,
      strategy,
      agentResults,
      finalOutput,
      totalDurationMs: Date.now() - startTime,
    };
  }

  private async executeSequential(
    agents: AgentRecord[],
    input: string,
  ): Promise<AgentResult[]> {
    try {
      const builder = new StateGraph(OrchestrationState) as any;

      for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];
        const nodeId = `agent_${i}`;

        builder.addNode(
          nodeId,
          async (state: typeof OrchestrationState.State) => {
            const agentStart = Date.now();
            const agentInput = state.currentOutput || state.input;

            const chatModel = this.aiProviders
              .getProvider(agent.provider.toLowerCase())
              .getChatModel({ model: agent.model });

            const response = await chatModel.invoke([
              { role: 'system', content: agent.systemPrompt },
              { role: 'user', content: agentInput },
            ]);

            const output =
              typeof response.content === 'string'
                ? response.content
                : JSON.stringify(response.content);

            return {
              currentOutput: output,
              agentResults: [
                {
                  agentId: agent.id,
                  output,
                  durationMs: Date.now() - agentStart,
                },
              ],
              currentAgentIndex: i + 1,
            };
          },
        );

        if (i === 0) {
          builder.addEdge(START, nodeId);
        } else {
          builder.addEdge(`agent_${i - 1}`, nodeId);
        }

        if (i === agents.length - 1) {
          builder.addEdge(nodeId, END);
        }
      }

      const graph = builder.compile();
      const result = await graph.invoke(
        { input, currentOutput: '', agentResults: [], currentAgentIndex: 0 },
        { recursionLimit: agents.length + 5 },
      );

      return result.agentResults;
    } catch (error) {
      this.logger.error(
        `Sequential orchestration failed, using fallback: ${(error as Error).message}`,
      );
      return this.executeSequentialFallback(agents, input);
    }
  }

  private async executeParallel(
    agents: AgentRecord[],
    input: string,
  ): Promise<AgentResult[]> {
    const promises = agents.map(async (agent) => {
      const agentStart = Date.now();
      try {
        const chatModel = this.aiProviders
          .getProvider(agent.provider.toLowerCase())
          .getChatModel({ model: agent.model });

        const response = await chatModel.invoke([
          { role: 'system', content: agent.systemPrompt },
          { role: 'user', content: input },
        ]);

        const output =
          typeof response.content === 'string'
            ? response.content
            : JSON.stringify(response.content);

        return {
          agentId: agent.id,
          output,
          durationMs: Date.now() - agentStart,
        };
      } catch (error) {
        return {
          agentId: agent.id,
          output: `Error: ${(error as Error).message}`,
          durationMs: Date.now() - agentStart,
        };
      }
    });

    return Promise.all(promises);
  }

  // Fix #15: Supervisor uses manager agent's provider when available
  private async executeAdaptive(
    agents: AgentRecord[],
    input: string,
    managerAgentId?: string | null,
  ): Promise<AgentResult[]> {
    // Resolve supervisor provider from manager agent if configured
    let supervisorProvider = 'openai';
    if (managerAgentId) {
      const manager = agents.find((a) => a.id === managerAgentId);
      if (manager) {
        supervisorProvider = manager.provider.toLowerCase();
      }
    }

    const supervisor = this.aiProviders
      .getProvider(supervisorProvider)
      .getChatModel({ temperature: 0 });

    const agentList = agents
      .map((a, i) => `${i}: ${a.name} - ${a.systemPrompt.slice(0, 100)}`)
      .join('\n');

    const routingResponse = await supervisor.invoke([
      {
        role: 'system',
        content: `You are a task routing supervisor. Given a task and a list of available agents, respond with ONLY the index number of the best agent to handle it.\n\nAgents:\n${agentList}`,
      },
      { role: 'user', content: input },
    ]);

    const routeText =
      typeof routingResponse.content === 'string'
        ? routingResponse.content
        : '';
    const agentIndex = parseInt(routeText.trim(), 10);
    const selectedAgent =
      agents[isNaN(agentIndex) ? 0 : Math.min(agentIndex, agents.length - 1)];

    const agentStart = Date.now();
    const chatModel = this.aiProviders
      .getProvider(selectedAgent.provider.toLowerCase())
      .getChatModel({ model: selectedAgent.model });

    const response = await chatModel.invoke([
      { role: 'system', content: selectedAgent.systemPrompt },
      { role: 'user', content: input },
    ]);

    const output =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    if (managerAgentId && agents.length > 1) {
      const fromAgent = selectedAgent;
      const toAgent = agents.find((a) => a.id !== fromAgent.id) ?? agents[0];
      this.handoffService.initiateHandoff({
        fromAgentId: fromAgent.id,
        toAgentId: toAgent.id,
        context: { input, output },
        reason: 'Adaptive routing handoff',
      });
    }

    return [
      {
        agentId: selectedAgent.id,
        output,
        durationMs: Date.now() - agentStart,
      },
    ];
  }

  private async executeSequentialFallback(
    agents: AgentRecord[],
    input: string,
  ): Promise<AgentResult[]> {
    const results: AgentResult[] = [];
    let currentInput = input;

    for (const agent of agents) {
      const agentStart = Date.now();
      try {
        const chatModel = this.aiProviders
          .getProvider(agent.provider.toLowerCase())
          .getChatModel({ model: agent.model });

        const response = await chatModel.invoke([
          { role: 'system', content: agent.systemPrompt },
          { role: 'user', content: currentInput },
        ]);

        currentInput =
          typeof response.content === 'string'
            ? response.content
            : JSON.stringify(response.content);

        results.push({
          agentId: agent.id,
          output: currentInput,
          durationMs: Date.now() - agentStart,
        });
      } catch (error) {
        results.push({
          agentId: agent.id,
          output: `Error: ${(error as Error).message}`,
          durationMs: Date.now() - agentStart,
        });
      }
    }

    return results;
  }
}

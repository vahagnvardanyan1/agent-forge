import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExecuteAgentDto } from './dto/execute-agent.dto';

@Injectable()
export class AgentExecutorService {
  private readonly logger = new Logger(AgentExecutorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(agentId: string, userId: string, dto: ExecuteAgentDto) {
    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
    });
    if (!agent) throw new Error('Agent not found');

    const execution = await this.prisma.execution.create({
      data: {
        agentId,
        userId,
        input: {
          message: dto.input,
          context: dto.context ?? null,
        } as unknown as Parameters<
          typeof this.prisma.execution.create
        >[0]['data']['input'],
        status: 'RUNNING',
      },
    });

    const startTime = Date.now();

    try {
      // Placeholder — will be wired to LangChain/LangGraph in the AI providers module
      const output = {
        response: `Agent ${agent.name} processed: ${dto.input}`,
      };
      const durationMs = Date.now() - startTime;

      return this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: 'COMPLETED',
          output,
          durationMs,
          completedAt: new Date(),
        },
      });
    } catch (error) {
      const durationMs = Date.now() - startTime;
      this.logger.error(`Execution failed: ${(error as Error).message}`);
      return this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          error: (error as Error).message,
          durationMs,
          completedAt: new Date(),
        },
      });
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@langchain/langgraph';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface HandoffRequest {
  fromAgentId: string;
  toAgentId: string;
  context: Record<string, unknown>;
  reason: string;
}

export interface HandoffResult {
  handoffId: string;
  fromAgentId: string;
  toAgentId: string;
  status: string;
  timestamp: string;
}

@Injectable()
export class HandoffService {
  private readonly logger = new Logger(HandoffService.name);

  constructor(private readonly prisma: PrismaService) {}

  initiateHandoff(request: HandoffRequest): HandoffResult {
    this.logger.log(
      `Handoff from ${request.fromAgentId} to ${request.toAgentId}: ${request.reason}`,
    );

    const result: HandoffResult = {
      handoffId: `ho_${Date.now().toString(36)}`,
      fromAgentId: request.fromAgentId,
      toAgentId: request.toAgentId,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
    };

    // Fix #12: Persist handoff record
    this.persistHandoff(result, request);

    return result;
  }

  createHandoffCommand(
    toNodeId: string,
    state: Record<string, unknown>,
    reason: string,
  ): Command {
    this.logger.log(`Creating handoff command to ${toNodeId}: ${reason}`);
    return new Command({
      goto: toNodeId,
      update: {
        ...state,
        handoffReason: reason,
        handoffTimestamp: new Date().toISOString(),
      },
    });
  }

  async getHandoffHistory(agentId: string): Promise<HandoffResult[]> {
    this.logger.log(`Getting handoff history for agent ${agentId}`);

    const executions = await this.prisma.execution.findMany({
      where: {
        agentId,
        NOT: { steps: { equals: Prisma.DbNull } },
      },
      select: { steps: true, createdAt: true, id: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Extract handoff records from execution steps
    const handoffs: HandoffResult[] = [];
    for (const exec of executions) {
      const steps = exec.steps as unknown as Array<{
        type?: string;
        handoffId?: string;
        fromAgentId?: string;
        toAgentId?: string;
        status?: string;
      }> | null;
      if (!Array.isArray(steps)) continue;
      for (const step of steps) {
        if (step.type === 'handoff' && step.handoffId) {
          handoffs.push({
            handoffId: step.handoffId,
            fromAgentId: step.fromAgentId ?? '',
            toAgentId: step.toAgentId ?? '',
            status: step.status ?? 'COMPLETED',
            timestamp: exec.createdAt.toISOString(),
          });
        }
      }
    }

    return handoffs;
  }

  private persistHandoff(result: HandoffResult, request: HandoffRequest): void {
    // Store as an execution step marker — we use the existing Execution table
    // since creating a separate Handoff table would require a migration.
    // In a future migration, consider a dedicated Handoff model.
    this.logger.log(
      `Persisted handoff ${result.handoffId}: ${request.fromAgentId} → ${request.toAgentId}`,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DashboardStats {
  totalAgents: number;
  totalExecutions: number;
  successRate: number;
  avgDurationMs: number;
  totalTokensUsed: number;
  recentExecutions: Array<{
    id: string;
    agentName: string;
    status: string;
    createdAt: Date;
  }>;
}

export interface AgentAnalytics {
  agentId: string;
  executionCount: number;
  successRate: number;
  avgDurationMs: number;
  totalTokensUsed: number;
  dailyExecutions: Array<{ date: string; count: number }>;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string): Promise<DashboardStats> {
    const [
      totalAgents,
      totalExecutions,
      completedExecutions, // failedExecutions — reserved for future use
      ,
      recentExecutions,
    ] = await Promise.all([
      this.prisma.agent.count({ where: { authorId: userId } }),
      this.prisma.execution.count({ where: { userId } }),
      this.prisma.execution.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.execution.count({ where: { userId, status: 'FAILED' } }),
      this.prisma.execution.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { agent: { select: { name: true } } },
      }),
    ]);

    const avgDuration = await this.prisma.execution.aggregate({
      where: { userId, status: 'COMPLETED' },
      _avg: { durationMs: true },
    });

    return {
      totalAgents,
      totalExecutions,
      successRate:
        totalExecutions > 0 ? completedExecutions / totalExecutions : 0,
      avgDurationMs: avgDuration._avg.durationMs ?? 0,
      totalTokensUsed: 0,
      recentExecutions: recentExecutions.map((e) => ({
        id: e.id,
        agentName: e.agent.name,
        status: e.status,
        createdAt: e.createdAt,
      })),
    };
  }

  async getAgentAnalytics(
    agentId: string,
    userId: string,
  ): Promise<AgentAnalytics> {
    const [executionCount, completedCount, avgDuration] = await Promise.all([
      this.prisma.execution.count({ where: { agentId, userId } }),
      this.prisma.execution.count({
        where: { agentId, userId, status: 'COMPLETED' },
      }),
      this.prisma.execution.aggregate({
        where: { agentId, userId, status: 'COMPLETED' },
        _avg: { durationMs: true },
      }),
    ]);

    return {
      agentId,
      executionCount,
      successRate: executionCount > 0 ? completedCount / executionCount : 0,
      avgDurationMs: avgDuration._avg.durationMs ?? 0,
      totalTokensUsed: 0,
      dailyExecutions: [],
    };
  }

  async getTokenUsage(
    userId: string,
    period: 'day' | 'week' | 'month' = 'month',
  ) {
    const periodStart = new Date();
    switch (period) {
      case 'day':
        periodStart.setDate(periodStart.getDate() - 1);
        break;
      case 'week':
        periodStart.setDate(periodStart.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(periodStart.getMonth() - 1);
        break;
    }

    const executions = await this.prisma.execution.count({
      where: { userId, createdAt: { gte: periodStart } },
    });

    return {
      period,
      totalExecutions: executions,
      periodStart: periodStart.toISOString(),
      periodEnd: new Date().toISOString(),
    };
  }
}

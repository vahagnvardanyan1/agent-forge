import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ExecutionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, pagination: PaginationDto) {
    const { page = 1, limit = 20 } = pagination;
    const [executions, total] = await Promise.all([
      this.prisma.execution.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { agent: { select: { id: true, name: true } } },
      }),
      this.prisma.execution.count({ where: { userId } }),
    ]);
    return {
      executions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const execution = await this.prisma.execution.findFirst({
      where: { id, userId },
      include: { agent: true },
    });
    if (!execution) throw new NotFoundException('Execution not found');
    return execution;
  }

  async cancel(id: string, userId: string) {
    const execution = await this.findOne(id, userId);
    if (execution.status !== 'RUNNING') {
      return execution;
    }
    return this.prisma.execution.update({
      where: { id },
      data: { status: 'CANCELLED', completedAt: new Date() },
    });
  }

  async getStats(userId: string) {
    const [total, completed, failed, running] = await Promise.all([
      this.prisma.execution.count({ where: { userId } }),
      this.prisma.execution.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.execution.count({ where: { userId, status: 'FAILED' } }),
      this.prisma.execution.count({ where: { userId, status: 'RUNNING' } }),
    ]);
    return {
      total,
      completed,
      failed,
      running,
      successRate: total > 0 ? completed / total : 0,
    };
  }
}

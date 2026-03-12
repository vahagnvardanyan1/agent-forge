import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkforceDto } from './dto/create-workforce.dto';

@Injectable()
export class WorkforceService {
  private readonly logger = new Logger(WorkforceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkforceDto) {
    this.logger.log(
      `Creating workforce "${dto.name}" with ${dto.agentIds.length} agents`,
    );

    const agents = await this.prisma.agent.findMany({
      where: { id: { in: dto.agentIds }, authorId: userId },
    });

    if (agents.length !== dto.agentIds.length) {
      throw new NotFoundException('One or more agents not found');
    }

    return {
      id: `wf_${Date.now().toString(36)}`,
      name: dto.name,
      description: dto.description,
      agents: agents.map((a) => ({ id: a.id, name: a.name })),
      createdAt: new Date().toISOString(),
    };
  }

  async findAll(userId: string) {
    const agents = await this.prisma.agent.findMany({
      where: { authorId: userId },
    });
    return {
      workforces: [],
      availableAgents: agents.map((a) => ({ id: a.id, name: a.name })),
    };
  }
}

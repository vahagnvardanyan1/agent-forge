import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAgentDto) {
    const slug =
      dto.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') +
      '-' +
      Date.now().toString(36);
    return this.prisma.agent.create({
      data: { ...dto, slug, authorId: userId },
    });
  }

  async findAll(userId: string, pagination: PaginationDto) {
    const { page = 1, limit = 20 } = pagination;
    const [agents, total] = await Promise.all([
      this.prisma.agent.findMany({
        where: { authorId: userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.agent.count({ where: { authorId: userId } }),
    ]);
    return { agents, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      include: {
        tools: true,
        knowledgeBases: { include: { knowledgeBase: true } },
        reviews: true,
      },
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async update(id: string, userId: string, dto: UpdateAgentDto) {
    const agent = await this.prisma.agent.findFirst({
      where: { id, authorId: userId },
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return this.prisma.agent.update({
      where: { id },
      data: dto as Parameters<typeof this.prisma.agent.update>[0]['data'],
    });
  }

  async remove(id: string, userId: string) {
    const agent = await this.prisma.agent.findFirst({
      where: { id, authorId: userId },
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return this.prisma.agent.delete({ where: { id } });
  }
}

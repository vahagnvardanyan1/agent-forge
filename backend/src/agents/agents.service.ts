import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import type { IntegrationType } from '@prisma/client';

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

  async createFromTemplate(userId: string, templateName: string) {
    const template = await this.prisma.agentTemplate.findUnique({
      where: { name: templateName },
    });
    if (!template) {
      throw new NotFoundException(`Template "${templateName}" not found`);
    }

    const slug = template.name + '-' + Date.now().toString(36);

    // Build system prompt with guardrails appended
    let systemPrompt = template.systemPrompt;
    if (template.guardrails) {
      const guardrails = template.guardrails as {
        do?: string[];
        dont?: string[];
      };
      const sections: string[] = [];
      if (guardrails.do?.length) {
        sections.push(
          '## Guardrails — Always Do\n' +
            guardrails.do.map((r) => `- ${r}`).join('\n'),
        );
      }
      if (guardrails.dont?.length) {
        sections.push(
          '## Guardrails — Never Do\n' +
            guardrails.dont.map((r) => `- ${r}`).join('\n'),
        );
      }
      if (sections.length > 0) {
        systemPrompt += '\n\n' + sections.join('\n\n');
      }
    }

    const agent = await this.prisma.agent.create({
      data: {
        name: template.displayName,
        slug,
        description: template.description,
        systemPrompt,
        provider: template.provider,
        model: template.model,
        temperature: template.temperature,
        maxTokens: template.maxTokens,
        category: template.category,
        memoryType: template.memoryType,
        conversationStarters: template.conversationStarters,
        guardrails: template.guardrails ?? undefined,
        templateName: template.name,
        status: 'ACTIVE',
        authorId: userId,
        tools: {
          create: template.toolNames.map((toolName) => ({
            type: 'WEBHOOK' as IntegrationType,
            config: { toolName },
          })),
        },
      },
      include: { tools: true },
    });

    // Increment usage count on the template
    await this.prisma.agentTemplate.update({
      where: { name: templateName },
      data: { usageCount: { increment: 1 } },
    });

    return agent;
  }
}

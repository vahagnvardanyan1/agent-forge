import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PublishAgentDto } from './dto/publish-agent.dto';
import { ReviewAgentDto } from './dto/review-agent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async browse(pagination: PaginationDto, category?: string, search?: string) {
    const { page = 1, limit = 20 } = pagination;
    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [agents, total] = await Promise.all([
      this.prisma.agent.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { downloads: 'desc' },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      this.prisma.agent.count({ where }),
    ]);
    return { agents, total, page, limit };
  }

  async publish(userId: string, dto: PublishAgentDto) {
    const agent = await this.prisma.agent.findFirst({
      where: { id: dto.agentId, authorId: userId },
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return this.prisma.agent.update({
      where: { id: dto.agentId },
      data: {
        isPublished: true,
        status: 'PUBLISHED',
        price: dto.price,
        category: dto.category,
        tags: dto.tags,
      },
    });
  }

  async addReview(agentId: string, userId: string, dto: ReviewAgentDto) {
    const review = await this.prisma.review.create({
      data: { agentId, userId, rating: dto.rating, comment: dto.comment },
    });
    const agg = await this.prisma.review.aggregate({
      where: { agentId },
      _avg: { rating: true },
    });
    await this.prisma.agent.update({
      where: { id: agentId },
      data: { rating: agg._avg.rating ?? 0 },
    });
    return review;
  }

  async getAgentDetail(id: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id, isPublished: true },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }
}

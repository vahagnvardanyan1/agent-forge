import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    const where = {
      isPublic: true,
      ...(category ? { category } : {}),
    };

    const templates = await this.prisma.agentTemplate.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { usageCount: 'desc' }],
    });

    // Group by category
    const grouped: Record<
      string,
      typeof templates
    > = {};
    for (const t of templates) {
      const cat = t.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(t);
    }

    return { templates, grouped };
  }

  async getCategories() {
    const templates = await this.prisma.agentTemplate.findMany({
      where: { isPublic: true },
      select: { category: true },
    });

    const countMap: Record<string, number> = {};
    for (const t of templates) {
      countMap[t.category] = (countMap[t.category] ?? 0) + 1;
    }

    return Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  async findByName(name: string) {
    const template = await this.prisma.agentTemplate.findUnique({
      where: { name },
    });
    if (!template) {
      throw new NotFoundException(`Template "${name}" not found`);
    }
    return template;
  }

  async incrementUsageCount(name: string) {
    await this.prisma.agentTemplate.update({
      where: { name },
      data: { usageCount: { increment: 1 } },
    });
  }
}

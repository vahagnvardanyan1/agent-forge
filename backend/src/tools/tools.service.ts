import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateToolDto, UpdateToolDto } from './dto/create-tool.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ToolsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateToolDto) {
    const existing = await this.prisma.toolDefinition.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Tool with name "${dto.name}" already exists`,
      );
    }

    if (!dto.steps || dto.steps.length === 0) {
      throw new BadRequestException('Tool must have at least one step');
    }

    return this.prisma.toolDefinition.create({
      data: {
        name: dto.name,
        displayName: dto.displayName,
        description: dto.description,
        category: dto.category,
        inputSchema: dto.inputSchema as unknown as Prisma.InputJsonValue,
        steps: dto.steps as unknown as Prisma.InputJsonValue,
        outputMapping: dto.outputMapping,
        requiresAuth: dto.requiresAuth,
        authConfig: dto.authConfig as unknown as Prisma.InputJsonValue,
        timeoutMs: dto.timeoutMs,
      },
    });
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 20 } = pagination;
    const [tools, total] = await Promise.all([
      this.prisma.toolDefinition.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.toolDefinition.count(),
    ]);
    return { tools, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const tool = await this.prisma.toolDefinition.findUnique({
      where: { id },
    });
    if (!tool) throw new NotFoundException('Tool definition not found');
    return tool;
  }

  async findByName(name: string) {
    const tool = await this.prisma.toolDefinition.findUnique({
      where: { name },
    });
    if (!tool) throw new NotFoundException('Tool definition not found');
    return tool;
  }

  async update(id: string, dto: UpdateToolDto) {
    const tool = await this.prisma.toolDefinition.findUnique({
      where: { id },
    });
    if (!tool) throw new NotFoundException('Tool definition not found');

    return this.prisma.toolDefinition.update({
      where: { id },
      data: dto as Parameters<
        typeof this.prisma.toolDefinition.update
      >[0]['data'],
    });
  }

  async remove(id: string) {
    const tool = await this.prisma.toolDefinition.findUnique({
      where: { id },
    });
    if (!tool) throw new NotFoundException('Tool definition not found');

    return this.prisma.toolDefinition.delete({ where: { id } });
  }
}

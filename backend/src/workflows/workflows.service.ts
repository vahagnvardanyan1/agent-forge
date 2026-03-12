import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  WorkflowEngineService,
  WorkflowExecutionResult,
} from './workflow-engine.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { ExecuteWorkflowDto } from './dto/execute-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: WorkflowEngineService,
  ) {}

  async create(userId: string, dto: CreateWorkflowDto) {
    return this.prisma.workflow.create({
      data: {
        name: dto.name,
        description: dto.description,
        flowConfig: {
          nodes: dto.nodes,
          edges: dto.edges,
        } as unknown as Parameters<
          typeof this.prisma.workflow.create
        >[0]['data']['flowConfig'],
      },
    });
  }

  async findAll(_userId: string) {
    return this.prisma.workflow.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string, _userId: string) {
    const workflow = await this.prisma.workflow.findFirst({ where: { id } });
    if (!workflow) throw new NotFoundException('Workflow not found');
    return workflow;
  }

  async execute(
    id: string,
    userId: string,
    dto: ExecuteWorkflowDto,
  ): Promise<WorkflowExecutionResult> {
    const workflow = await this.findOne(id, userId);
    const flowConfig = workflow.flowConfig as {
      nodes: Array<{
        id: string;
        type: string;
        config?: Record<string, unknown>;
      }>;
      edges: Array<{ from: string; to: string; condition?: string }>;
    };
    const nodes = flowConfig.nodes ?? [];
    const edges = flowConfig.edges ?? [];
    return this.engine.executeWorkflow(nodes, edges, dto.input);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workflow.delete({ where: { id } });
  }
}

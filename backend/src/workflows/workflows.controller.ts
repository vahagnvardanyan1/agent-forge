import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { ExecuteWorkflowDto } from './dto/execute-workflow.dto';
import type { WorkflowExecutionResult } from './workflow-engine.service';

@ApiTags('Workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a workflow' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateWorkflowDto) {
    return this.workflowsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List workflows' })
  findAll(@CurrentUser('id') userId: string) {
    return this.workflowsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by ID' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.workflowsService.findOne(id, userId);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute a workflow' })
  execute(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ExecuteWorkflowDto,
  ): Promise<WorkflowExecutionResult> {
    return this.workflowsService.execute(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.workflowsService.remove(id, userId);
  }
}

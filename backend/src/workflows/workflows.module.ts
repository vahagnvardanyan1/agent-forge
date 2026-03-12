import { Module } from '@nestjs/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { WorkflowEngineService } from './workflow-engine.service';
import { AiProvidersModule } from '../ai-providers/ai-providers.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';

@Module({
  imports: [AiProvidersModule, KnowledgeModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowEngineService],
  exports: [WorkflowsService, WorkflowEngineService],
})
export class WorkflowsModule {}

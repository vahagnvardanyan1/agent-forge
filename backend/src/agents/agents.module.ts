import { Module, OnModuleInit } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { AgentExecutorService } from './agent-executor.service';
import { AiProvidersModule } from '../ai-providers/ai-providers.module';
import { LangchainModule } from '../langchain/langchain.module';
import { ExecutionModule } from '../execution/execution.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { ExecutionQueueProcessor } from '../execution/execution-queue.processor';

@Module({
  imports: [
    AiProvidersModule,
    LangchainModule,
    ExecutionModule,
    KnowledgeModule,
  ],
  controllers: [AgentsController],
  providers: [AgentsService, AgentExecutorService],
  exports: [AgentsService, AgentExecutorService],
})
export class AgentsModule implements OnModuleInit {
  constructor(
    private readonly executor: AgentExecutorService,
    private readonly queueProcessor: ExecutionQueueProcessor,
  ) {}

  onModuleInit() {
    // Fix #9: Wire the real agent executor into the queue processor
    this.queueProcessor.setExecutor((agentId, userId, dto) =>
      this.executor.execute(agentId, userId, dto),
    );
  }
}

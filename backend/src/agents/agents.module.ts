import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { AgentExecutorService } from './agent-executor.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService, AgentExecutorService],
  exports: [AgentsService, AgentExecutorService],
})
export class AgentsModule {}

import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionGateway } from './execution.gateway';
import { ExecutionQueueProcessor } from './execution-queue.processor';

@Module({
  providers: [ExecutionService, ExecutionGateway, ExecutionQueueProcessor],
  exports: [ExecutionService, ExecutionGateway, ExecutionQueueProcessor],
})
export class ExecutionModule {}

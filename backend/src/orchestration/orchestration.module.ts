import { Module } from '@nestjs/common';
import { OrchestrationService } from './orchestration.service';
import { WorkforceService } from './workforce.service';
import { HandoffService } from './handoff.service';

@Module({
  providers: [OrchestrationService, WorkforceService, HandoffService],
  exports: [OrchestrationService, WorkforceService, HandoffService],
})
export class OrchestrationModule {}

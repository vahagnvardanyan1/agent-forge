import { Injectable, Logger } from '@nestjs/common';
import { ExecutionGateway } from './execution.gateway';

interface ExecutionJob {
  executionId: string;
  agentId: string;
  userId: string;
  input: string;
  context?: Record<string, unknown>;
}

@Injectable()
export class ExecutionQueueProcessor {
  private readonly logger = new Logger(ExecutionQueueProcessor.name);
  private queue: ExecutionJob[] = [];
  private processing = false;

  constructor(private readonly gateway: ExecutionGateway) {}

  enqueue(job: ExecutionJob): void {
    this.queue.push(job);
    this.logger.log(`Enqueued execution ${job.executionId}`);
    if (!this.processing) {
      void this.processQueue();
    }
  }

  private processQueue(): void {
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) break;

      try {
        this.logger.log(`Processing execution ${job.executionId}`);
        this.gateway.emitExecutionUpdate(job.executionId, {
          status: 'RUNNING',
        });

        this.gateway.emitExecutionUpdate(job.executionId, {
          status: 'COMPLETED',
          output: { response: `Processed: ${job.input}` },
        });
      } catch (error) {
        this.logger.error(
          `Execution ${job.executionId} failed: ${(error as Error).message}`,
        );
        this.gateway.emitExecutionUpdate(job.executionId, {
          status: 'FAILED',
          error: (error as Error).message,
        });
      }
    }

    this.processing = false;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

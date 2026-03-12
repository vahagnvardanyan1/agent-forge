import { Injectable, Logger } from '@nestjs/common';
import { ExecutionGateway } from './execution.gateway';

interface ExecutionJob {
  executionId: string;
  agentId: string;
  userId: string;
  input: string;
  context?: Record<string, unknown>;
}

type ExecutorFn = (
  agentId: string,
  userId: string,
  dto: { input: string; context?: Record<string, unknown> },
) => Promise<unknown>;

@Injectable()
export class ExecutionQueueProcessor {
  private readonly logger = new Logger(ExecutionQueueProcessor.name);
  private queue: ExecutionJob[] = [];
  private processing = false;
  private concurrency = 3;
  private activeCount = 0;
  private executor: ExecutorFn | null = null;

  constructor(private readonly gateway: ExecutionGateway) {}

  setExecutor(executor: ExecutorFn) {
    this.executor = executor;
  }

  enqueue(job: ExecutionJob): void {
    this.queue.push(job);
    this.logger.log(
      `Enqueued execution ${job.executionId} (queue length: ${this.queue.length})`,
    );
    void this.processNext();
  }

  private async processNext(): Promise<void> {
    if (this.activeCount >= this.concurrency) return;
    const job = this.queue.shift();
    if (!job) return;

    this.activeCount++;
    try {
      await this.processJob(job);
    } finally {
      this.activeCount--;
      // Process next job if any remain
      if (this.queue.length > 0) {
        void this.processNext();
      }
    }
  }

  private async processJob(job: ExecutionJob): Promise<void> {
    try {
      this.logger.log(`Processing execution ${job.executionId}`);
      this.gateway.emitExecutionUpdate(job.executionId, {
        status: 'RUNNING',
      });

      if (this.executor) {
        await this.executor(job.agentId, job.userId, {
          input: job.input,
          context: job.context,
        });
      } else {
        this.logger.warn(
          `No executor configured — execution ${job.executionId} cannot be processed`,
        );
        this.gateway.emitExecutionUpdate(job.executionId, {
          status: 'FAILED',
          error: 'No executor configured',
        });
      }
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

  getQueueLength(): number {
    return this.queue.length;
  }

  getActiveCount(): number {
    return this.activeCount;
  }
}

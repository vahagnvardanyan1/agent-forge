import { Injectable, Logger } from '@nestjs/common';
import { KnowledgeService } from '../../../knowledge/knowledge.service';
import { InterpolationEngine } from '../interpolation-engine.js';
import type { StepExecutor, StepContext } from './step-executor.interface';

@Injectable()
export class KnowledgeSearchStepExecutor implements StepExecutor {
  private readonly logger = new Logger(KnowledgeSearchStepExecutor.name);

  constructor(
    private readonly knowledgeService: KnowledgeService,
    private readonly interpolationEngine: InterpolationEngine,
  ) {}

  async execute(
    config: Record<string, unknown>,
    context: StepContext,
  ): Promise<string> {
    const knowledgeBaseId = config.knowledgeBaseId as string;
    if (!knowledgeBaseId) {
      throw new Error(
        'Knowledge search step requires a "knowledgeBaseId" config field',
      );
    }

    const queryTemplate = (config.query as string) ?? '{{input.query}}';
    const query = this.interpolationEngine.interpolateString(
      queryTemplate,
      context,
    );
    const topK = (config.topK as number) ?? 5;

    this.logger.log(
      `Knowledge search: kb=${knowledgeBaseId}, topK=${topK}, query="${query.slice(0, 100)}"`,
    );

    const results = await this.knowledgeService.query(knowledgeBaseId, {
      query,
      topK,
    });

    const matches = (results.matches ?? []) as Array<{
      metadata?: Record<string, unknown>;
    }>;
    const texts: string[] = matches
      .filter((m) => m.metadata)
      .map((m) => {
        const metadata = m.metadata!;
        const value = metadata.text ?? metadata.content;
        if (typeof value === 'string') return value;
        return JSON.stringify(value ?? metadata);
      });

    return texts.join('\n\n---\n\n');
  }
}

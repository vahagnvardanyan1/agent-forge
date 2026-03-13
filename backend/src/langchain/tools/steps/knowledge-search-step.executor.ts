import { Injectable, Logger } from '@nestjs/common';
import { KnowledgeService } from '../../../knowledge/knowledge.service';
import type { StepExecutor, StepContext } from './step-executor.interface';

@Injectable()
export class KnowledgeSearchStepExecutor implements StepExecutor {
  private readonly logger = new Logger(KnowledgeSearchStepExecutor.name);

  constructor(private readonly knowledgeService: KnowledgeService) {}

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
    const query = this.interpolate(queryTemplate, context);
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

  private interpolate(template: string, context: StepContext): string {
    return template.replace(/\{\{(.+?)\}\}/g, (_match, path: string) => {
      const value = this.resolvePath(
        path.trim(),
        context as unknown as Record<string, unknown>,
      );
      if (value === undefined) return '';
      return typeof value === 'object'
        ? JSON.stringify(value)
        : String(value as string | number | boolean);
    });
  }

  private resolvePath(path: string, obj: Record<string, unknown>): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
      if (current == null || typeof current !== 'object') return undefined;
      return (current as Record<string, unknown>)[key];
    }, obj);
  }
}

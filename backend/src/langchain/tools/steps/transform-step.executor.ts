import { Injectable, Logger } from '@nestjs/common';
import type { StepExecutor, StepContext } from './step-executor.interface';

@Injectable()
export class TransformStepExecutor implements StepExecutor {
  private readonly logger = new Logger(TransformStepExecutor.name);

  execute(
    config: Record<string, unknown>,
    context: StepContext,
  ): Promise<string> {
    const template = config.template as string;
    if (!template) {
      throw new Error('Transform step requires a "template" config field');
    }

    const result = this.interpolate(template, context);
    this.logger.debug(`Transform result: ${result.slice(0, 200)}`);
    return Promise.resolve(result);
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

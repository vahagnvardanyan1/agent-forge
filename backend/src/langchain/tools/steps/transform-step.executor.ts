import { Injectable, Logger } from '@nestjs/common';
import { InterpolationEngine } from '../interpolation-engine.js';
import type { StepExecutor, StepContext } from './step-executor.interface';

@Injectable()
export class TransformStepExecutor implements StepExecutor {
  private readonly logger = new Logger(TransformStepExecutor.name);

  constructor(private readonly interpolationEngine: InterpolationEngine) {}

  execute(
    config: Record<string, unknown>,
    context: StepContext,
  ): Promise<string> {
    const template = config.template as string;
    if (!template) {
      throw new Error('Transform step requires a "template" config field');
    }

    const result = this.interpolationEngine.interpolateString(
      template,
      context,
    );
    this.logger.debug(`Transform result: ${result.slice(0, 200)}`);
    return Promise.resolve(result);
  }
}

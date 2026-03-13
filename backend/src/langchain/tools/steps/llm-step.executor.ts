import { Injectable, Logger } from '@nestjs/common';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AiProvidersService } from '../../../ai-providers/ai-providers.service';
import type { StepExecutor, StepContext } from './step-executor.interface';

@Injectable()
export class LlmStepExecutor implements StepExecutor {
  private readonly logger = new Logger(LlmStepExecutor.name);

  constructor(private readonly aiProviders: AiProvidersService) {}

  async execute(
    config: Record<string, unknown>,
    context: StepContext,
  ): Promise<string> {
    const systemPrompt = config.systemPrompt as string | undefined;
    const userPrompt = config.userPrompt as string;
    if (!userPrompt) {
      throw new Error('LLM step requires a "userPrompt" config field');
    }

    const provider = (config.provider as string) ?? 'openai';
    const model = config.model as string | undefined;
    const temperature = config.temperature as number | undefined;
    const maxTokens = config.maxTokens as number | undefined;

    const interpolatedUser = this.interpolate(userPrompt, context);
    const interpolatedSystem = systemPrompt
      ? this.interpolate(systemPrompt, context)
      : undefined;

    this.logger.log(
      `LLM step: provider=${provider}, model=${model ?? 'default'}`,
    );

    const chatModel = this.aiProviders
      .getProvider(provider)
      .getChatModel({ model, temperature, maxTokens });

    const messages = [];
    if (interpolatedSystem) {
      messages.push(new SystemMessage(interpolatedSystem));
    }
    messages.push(new HumanMessage(interpolatedUser));

    const response = await chatModel.invoke(messages);
    const content =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    return content;
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

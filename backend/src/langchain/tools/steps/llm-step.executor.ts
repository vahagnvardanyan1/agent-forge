import { Injectable, Logger } from '@nestjs/common';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AiProvidersService } from '../../../ai-providers/ai-providers.service';
import { InterpolationEngine } from '../interpolation-engine.js';
import type { StepExecutor, StepContext } from './step-executor.interface';

@Injectable()
export class LlmStepExecutor implements StepExecutor {
  private readonly logger = new Logger(LlmStepExecutor.name);

  constructor(
    private readonly aiProviders: AiProvidersService,
    private readonly interpolationEngine: InterpolationEngine,
  ) {}

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

    const interpolatedUser = this.interpolationEngine.interpolateString(
      userPrompt,
      context,
    );
    const interpolatedSystem = systemPrompt
      ? this.interpolationEngine.interpolateString(systemPrompt, context)
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
}

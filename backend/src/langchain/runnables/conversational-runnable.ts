import { Injectable, Logger } from '@nestjs/common';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import { AiProvidersService } from '../../ai-providers/ai-providers.service';

export interface ConversationalInput {
  message: string;
  history: Array<{ role: string; content: string }>;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  provider?: string;
}

export interface ConversationalOutput {
  response: string;
  tokensUsed: number;
  model: string;
}

@Injectable()
export class ConversationalRunnable {
  private readonly logger = new Logger(ConversationalRunnable.name);

  constructor(private readonly aiProviders: AiProvidersService) {}

  async invoke(input: ConversationalInput): Promise<ConversationalOutput> {
    this.logger.log(
      `Conversational invoke with ${input.history.length} history messages`,
    );

    const providerName = input.provider ?? 'openai';
    const model = this.aiProviders.getProvider(providerName).getChatModel({
      model: input.model,
      temperature: input.temperature,
    });

    const systemPrompt =
      input.systemPrompt ?? 'You are a helpful AI assistant.';

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    const history: BaseMessage[] = input.history.map((m) =>
      m.role === 'user'
        ? new HumanMessage(m.content)
        : new AIMessage(m.content),
    );

    // Fix #5: Invoke model directly (not through StringOutputParser) to get token metadata
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      input: input.message,
      history,
    });

    const tokensUsed =
      (response.usage_metadata?.input_tokens ?? 0) +
      (response.usage_metadata?.output_tokens ?? 0);

    const content =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    return {
      response: content,
      tokensUsed,
      model: input.model ?? 'gpt-4o',
    };
  }

  async *stream(input: ConversationalInput): AsyncGenerator<string> {
    this.logger.log(
      `Conversational stream with ${input.history.length} history messages`,
    );

    const providerName = input.provider ?? 'openai';
    const model = this.aiProviders.getProvider(providerName).getChatModel({
      model: input.model,
      temperature: input.temperature,
    });

    const systemPrompt =
      input.systemPrompt ?? 'You are a helpful AI assistant.';

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const history: BaseMessage[] = input.history.map((m) =>
      m.role === 'user'
        ? new HumanMessage(m.content)
        : new AIMessage(m.content),
    );

    const stream = await chain.stream({
      input: input.message,
      history,
    });

    for await (const chunk of stream) {
      yield chunk;
    }
  }
}

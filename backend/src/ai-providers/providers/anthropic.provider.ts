import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ChatAnthropic } from '@langchain/anthropic';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type {
  IAIProvider,
  CompletionParams,
  CompletionResult,
  ChatModelParams,
} from './base-provider.interface';

@Injectable()
export class AnthropicProvider implements IAIProvider {
  private client: Anthropic | null = null;
  private chatModelCache = new Map<string, BaseChatModel>();

  private getClient(): Anthropic {
    if (!this.client) {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');
      this.client = new Anthropic({ apiKey });
    }
    return this.client;
  }

  async complete(params: CompletionParams): Promise<CompletionResult> {
    const systemMessage = params.messages.find((m) => m.role === 'system');
    const userMessages = params.messages.filter((m) => m.role !== 'system');

    const response = await this.getClient().messages.create({
      model: params.model || 'claude-sonnet-4-20250514',
      max_tokens: params.maxTokens ?? 4096,
      system: systemMessage?.content,
      messages: userMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    return {
      content: textBlock?.text ?? '',
      tokensUsed:
        (response.usage?.input_tokens ?? 0) +
        (response.usage?.output_tokens ?? 0),
      model: params.model || 'claude-sonnet-4-20250514',
      provider: 'anthropic',
    };
  }

  async *streamComplete(params: CompletionParams): AsyncGenerator<string> {
    const systemMessage = params.messages.find((m) => m.role === 'system');
    const userMessages = params.messages.filter((m) => m.role !== 'system');

    const stream = this.getClient().messages.stream({
      model: params.model || 'claude-sonnet-4-20250514',
      max_tokens: params.maxTokens ?? 4096,
      system: systemMessage?.content,
      messages: userMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text;
      }
    }
  }

  listModels(): string[] {
    return [
      'claude-opus-4-20250514',
      'claude-sonnet-4-20250514',
      'claude-haiku-4-5-20251001',
    ];
  }

  getChatModel(params?: ChatModelParams): BaseChatModel {
    const key = `${params?.model ?? 'claude-sonnet-4-20250514'}:${params?.temperature ?? 0.7}:${params?.maxTokens ?? 4096}`;
    let cached = this.chatModelCache.get(key);
    if (!cached) {
      cached = new ChatAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: params?.model ?? 'claude-sonnet-4-20250514',
        temperature: params?.temperature ?? 0.7,
        maxTokens: params?.maxTokens ?? 4096,
      });
      this.chatModelCache.set(key, cached);
    }
    return cached;
  }
}

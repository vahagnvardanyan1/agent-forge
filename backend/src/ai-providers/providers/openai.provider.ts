import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatOpenAI } from '@langchain/openai';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type {
  IAIProvider,
  CompletionParams,
  CompletionResult,
  ChatModelParams,
} from './base-provider.interface';

@Injectable()
export class OpenAIProvider implements IAIProvider {
  private client: OpenAI | null = null;
  private chatModelCache = new Map<string, BaseChatModel>();

  private getClient(): OpenAI {
    if (!this.client) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
      this.client = new OpenAI({ apiKey });
    }
    return this.client;
  }

  async complete(params: CompletionParams): Promise<CompletionResult> {
    const response = await this.getClient().chat.completions.create({
      model: params.model || 'gpt-4o',
      messages: params.messages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 4096,
    });

    return {
      content: response.choices[0]?.message?.content ?? '',
      tokensUsed: response.usage?.total_tokens ?? 0,
      model: params.model || 'gpt-4o',
      provider: 'openai',
    };
  }

  async *streamComplete(params: CompletionParams): AsyncGenerator<string> {
    const stream = await this.getClient().chat.completions.create({
      model: params.model || 'gpt-4o',
      messages: params.messages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 4096,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }

  listModels(): string[] {
    return ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];
  }

  getChatModel(params?: ChatModelParams): BaseChatModel {
    const key = `${params?.model ?? 'gpt-4o'}:${params?.temperature ?? 0.7}:${params?.maxTokens ?? 4096}`;
    let cached = this.chatModelCache.get(key);
    if (!cached) {
      cached = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: params?.model ?? 'gpt-4o',
        temperature: params?.temperature ?? 0.7,
        maxTokens: params?.maxTokens ?? 4096,
      });
      this.chatModelCache.set(key, cached);
    }
    return cached;
  }
}

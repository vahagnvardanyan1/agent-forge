import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type {
  IAIProvider,
  CompletionParams,
  CompletionResult,
  ChatModelParams,
} from './base-provider.interface';

@Injectable()
export class GoogleProvider implements IAIProvider {
  private client: GoogleGenerativeAI | null = null;
  private chatModelCache = new Map<string, BaseChatModel>();

  private getClient(): GoogleGenerativeAI {
    if (!this.client) {
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is not configured');
      this.client = new GoogleGenerativeAI(apiKey);
    }
    return this.client;
  }

  async complete(params: CompletionParams): Promise<CompletionResult> {
    const model = this.getClient().getGenerativeModel({
      model: params.model || 'gemini-pro',
    });
    const prompt = params.messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      content: text,
      tokensUsed: 0,
      model: params.model || 'gemini-pro',
      provider: 'google',
    };
  }

  async *streamComplete(params: CompletionParams): AsyncGenerator<string> {
    const model = this.getClient().getGenerativeModel({
      model: params.model || 'gemini-pro',
    });
    const prompt = params.messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }

  listModels(): string[] {
    return ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-flash'];
  }

  getChatModel(params?: ChatModelParams): BaseChatModel {
    const key = `${params?.model ?? 'gemini-pro'}:${params?.temperature ?? 0.7}:${params?.maxTokens ?? 4096}`;
    let cached = this.chatModelCache.get(key);
    if (!cached) {
      cached = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_AI_API_KEY,
        model: params?.model ?? 'gemini-pro',
        temperature: params?.temperature ?? 0.7,
        maxOutputTokens: params?.maxTokens ?? 4096,
      });
      this.chatModelCache.set(key, cached);
    }
    return cached;
  }
}

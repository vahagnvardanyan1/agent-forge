import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

export interface CompletionParams {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface CompletionResult {
  content: string;
  tokensUsed: number;
  model: string;
  provider: string;
}

export interface ChatModelParams {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface IAIProvider {
  complete(params: CompletionParams): Promise<CompletionResult>;
  streamComplete(params: CompletionParams): AsyncGenerator<string>;
  listModels(): string[];
  getChatModel(params?: ChatModelParams): BaseChatModel;
}

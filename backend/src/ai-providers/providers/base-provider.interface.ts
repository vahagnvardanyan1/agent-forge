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

export interface IAIProvider {
  complete(params: CompletionParams): Promise<CompletionResult>;
  streamComplete(params: CompletionParams): AsyncGenerator<string>;
  listModels(): string[];
}

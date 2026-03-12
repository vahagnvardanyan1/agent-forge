import { Injectable, Logger } from '@nestjs/common';

export interface RagInput {
  query: string;
  knowledgeBaseId: string;
  systemPrompt?: string;
  model?: string;
}

export interface RagOutput {
  answer: string;
  sources: Array<{
    content: string;
    score: number;
    metadata: Record<string, unknown>;
  }>;
  tokensUsed: number;
}

@Injectable()
export class RagRunnable {
  private readonly logger = new Logger(RagRunnable.name);

  invoke(input: RagInput): RagOutput {
    this.logger.log(
      `RAG query on knowledge base ${input.knowledgeBaseId}: ${input.query.slice(0, 100)}`,
    );

    return {
      answer: `RAG response for: ${input.query}`,
      sources: [],
      tokensUsed: 0,
    };
  }

  *stream(input: RagInput): Generator<string> {
    this.logger.log(`RAG stream on knowledge base ${input.knowledgeBaseId}`);
    const words = `Streaming RAG response for: ${input.query}`.split(' ');
    for (const word of words) {
      yield word + ' ';
    }
  }
}

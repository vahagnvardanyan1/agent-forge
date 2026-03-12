import { Injectable, Logger } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);
  private embeddingsCache = new Map<string, OpenAIEmbeddings>();

  /**
   * Returns an embeddings instance for the given model.
   * Currently only OpenAI models are supported (text-embedding-3-small, text-embedding-3-large, text-embedding-ada-002).
   * Future: add support for other providers when LangChain stabilizes their embedding APIs.
   */
  private getEmbeddings(model?: string): OpenAIEmbeddings {
    const embeddingModel = model ?? 'text-embedding-3-small';
    let cached = this.embeddingsCache.get(embeddingModel);
    if (!cached) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
      cached = new OpenAIEmbeddings({
        apiKey,
        model: embeddingModel,
      });
      this.embeddingsCache.set(embeddingModel, cached);
    }
    return cached;
  }

  async generateEmbedding(text: string, model?: string): Promise<number[]> {
    return this.getEmbeddings(model).embedQuery(text);
  }

  async generateBatchEmbeddings(
    texts: string[],
    model?: string,
  ): Promise<number[][]> {
    return this.getEmbeddings(model).embedDocuments(texts);
  }
}

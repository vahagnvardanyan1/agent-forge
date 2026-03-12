import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingsService {
  private client: OpenAI | null = null;

  private getClient(): OpenAI {
    if (!this.client) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
      this.client = new OpenAI({ apiKey });
    }
    return this.client;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.getClient().embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await this.getClient().embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });
    return response.data.map((d) => d.embedding);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService {
  private readonly logger = new Logger(PineconeService.name);
  private client: Pinecone | null = null;

  private getClient(): Pinecone {
    if (!this.client) {
      const apiKey = process.env.PINECONE_API_KEY;
      if (!apiKey) throw new Error('PINECONE_API_KEY is not configured');
      this.client = new Pinecone({ apiKey });
    }
    return this.client;
  }

  async getIndex(name: string) {
    const client = this.getClient();
    const indexModel = await client.describeIndex(name);
    return client.index(indexModel.name);
  }

  async upsertVectors(
    indexName: string,
    namespace: string,
    records: Array<{
      id: string;
      values: number[];
      metadata?: Record<string, unknown>;
    }>,
  ) {
    const index = await this.getIndex(indexName);
    await index
      .namespace(namespace)
      .upsert({ records } as unknown as Parameters<
        ReturnType<ReturnType<Pinecone['index']>['namespace']>['upsert']
      >[0]);
  }

  async query(
    indexName: string,
    namespace: string,
    vector: number[],
    topK: number = 5,
  ) {
    const index = await this.getIndex(indexName);
    return index
      .namespace(namespace)
      .query({ vector, topK, includeMetadata: true });
  }

  async deleteVectors(indexName: string, namespace: string, ids: string[]) {
    const index = await this.getIndex(indexName);
    await index.namespace(namespace).deleteMany(ids);
  }
}

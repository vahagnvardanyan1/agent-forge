/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { PineconeService } from '../../knowledge/pinecone.service';
import { EmbeddingsService } from '../../knowledge/embeddings.service';

export interface VectorMemoryEntry {
  id: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, unknown>;
  score?: number;
}

@Injectable()
export class VectorMemory {
  private readonly logger = new Logger(VectorMemory.name);

  constructor(
    private readonly pinecone: PineconeService,
    private readonly embeddings: EmbeddingsService,
  ) {}

  async addEntry(
    namespace: string,
    entry: Omit<VectorMemoryEntry, 'score'>,
  ): Promise<void> {
    const embedding =
      entry.embedding ??
      (await this.embeddings.generateEmbedding(entry.content));

    const indexHost = process.env.PINECONE_MEMORY_INDEX ?? 'agentforge-memory';

    await this.pinecone.upsertVectors(indexHost, namespace, [
      {
        id: entry.id,
        values: embedding,
        metadata: { ...entry.metadata, content: entry.content },
      },
    ]);

    this.logger.log(`Added vector memory entry to namespace ${namespace}`);
  }

  async search(
    namespace: string,
    queryEmbedding: number[],
    topK: number = 5,
  ): Promise<VectorMemoryEntry[]> {
    const indexHost = process.env.PINECONE_MEMORY_INDEX ?? 'agentforge-memory';

    const results = await this.pinecone.query(
      indexHost,
      namespace,
      queryEmbedding,
      topK,
    );

    return (results.matches ?? []).map((match: any) => ({
      id: match.id as string,
      content: (match.metadata?.content as string) ?? '',
      metadata: (match.metadata as Record<string, unknown>) ?? {},
      score: (match.score as number) ?? 0,
    }));
  }

  async searchByText(
    namespace: string,
    query: string,
    topK: number = 5,
  ): Promise<VectorMemoryEntry[]> {
    const queryEmbedding = await this.embeddings.generateEmbedding(query);
    return this.search(namespace, queryEmbedding, topK);
  }

  // Fix #13: Actually clear the namespace by deleting all vectors
  async clearNamespace(namespace: string): Promise<void> {
    this.logger.log(`Clearing vector memory namespace ${namespace}`);
    const indexHost = process.env.PINECONE_MEMORY_INDEX ?? 'agentforge-memory';
    try {
      const index = await this.pinecone.getIndex(indexHost);
      await index.namespace(namespace).deleteAll();
      this.logger.log(`Successfully cleared namespace ${namespace}`);
    } catch (error) {
      this.logger.error(
        `Failed to clear namespace ${namespace}: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}

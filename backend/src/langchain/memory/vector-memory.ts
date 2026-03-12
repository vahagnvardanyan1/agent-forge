import { Injectable, Logger } from '@nestjs/common';

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
  private store: Map<string, VectorMemoryEntry[]> = new Map();

  addEntry(namespace: string, entry: Omit<VectorMemoryEntry, 'score'>): void {
    const entries = this.store.get(namespace) ?? [];
    entries.push(entry);
    this.store.set(namespace, entries);
    this.logger.log(`Added vector memory entry to namespace ${namespace}`);
  }

  search(
    namespace: string,
    _queryEmbedding: number[],
    topK: number = 5,
  ): VectorMemoryEntry[] {
    const entries = this.store.get(namespace) ?? [];
    return entries.slice(0, topK).map((entry) => ({ ...entry, score: 0.9 }));
  }

  clearNamespace(namespace: string): void {
    this.store.delete(namespace);
  }
}

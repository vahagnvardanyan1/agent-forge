export interface KnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  pineconeIndexHost: string;
  pineconeNamespace: string;
  embeddingModel: string;
  documentCount: number;
  chunkCount: number;
  documents: KnowledgeDocument[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  chunkCount: number;
  storageUrl: string;
  knowledgeBaseId: string;
  createdAt: string;
}

export interface QueryResult {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
  content?: string;
}

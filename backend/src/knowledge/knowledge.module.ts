import { Module } from '@nestjs/common';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { PineconeService } from './pinecone.service';
import { EmbeddingsService } from './embeddings.service';
import { DocumentLoaderService } from './document-loader.service';

@Module({
  controllers: [KnowledgeController],
  providers: [
    KnowledgeService,
    PineconeService,
    EmbeddingsService,
    DocumentLoaderService,
  ],
  exports: [KnowledgeService, PineconeService, EmbeddingsService],
})
export class KnowledgeModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PineconeService } from './pinecone.service';
import { EmbeddingsService } from './embeddings.service';
import { DocumentLoaderService } from './document-loader.service';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { QueryKnowledgeDto } from './dto/query-knowledge.dto';

@Injectable()
export class KnowledgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pinecone: PineconeService,
    private readonly embeddings: EmbeddingsService,
    private readonly documentLoader: DocumentLoaderService,
  ) {}

  async create(userId: string, dto: CreateKnowledgeBaseDto) {
    return this.prisma.knowledgeBase.create({
      data: {
        name: dto.name,
        description: dto.description,
        pineconeIndexHost: 'agentforge-knowledge',
        pineconeNamespace: `kb-${Date.now().toString(36)}`,
        ownerId: userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.knowledgeBase.findMany({
      where: { ownerId: userId },
      include: { documents: true },
    });
  }

  async findOne(id: string) {
    const kb = await this.prisma.knowledgeBase.findUnique({
      where: { id },
      include: { documents: true },
    });
    if (!kb) throw new NotFoundException('Knowledge base not found');
    return kb;
  }

  async uploadDocument(knowledgeBaseId: string, file: Express.Multer.File) {
    const kb = await this.findOne(knowledgeBaseId);
    const chunks = await this.documentLoader.loadAndChunk(
      file.originalname,
      file.buffer,
      file.mimetype,
    );
    const embeddings = await this.embeddings.generateBatchEmbeddings(
      chunks.map((c) => c.content),
    );

    const records = chunks.map((chunk, i) => ({
      id: `${knowledgeBaseId}-${Date.now()}-${i}`,
      values: embeddings[i],
      metadata: { ...chunk.metadata, knowledgeBaseId },
    }));

    await this.pinecone.upsertVectors(
      kb.pineconeIndexHost,
      kb.pineconeNamespace,
      records,
    );

    const doc = await this.prisma.document.create({
      data: {
        filename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        chunkCount: chunks.length,
        storageUrl: `uploads/${file.originalname}`,
        knowledgeBaseId,
      },
    });

    await this.prisma.knowledgeBase.update({
      where: { id: knowledgeBaseId },
      data: {
        documentCount: { increment: 1 },
        chunkCount: { increment: chunks.length },
      },
    });

    return doc;
  }

  async query(knowledgeBaseId: string, dto: QueryKnowledgeDto) {
    const kb = await this.findOne(knowledgeBaseId);
    const queryEmbedding = await this.embeddings.generateEmbedding(dto.query);
    return this.pinecone.query(
      kb.pineconeIndexHost,
      kb.pineconeNamespace,
      queryEmbedding,
      dto.topK ?? 5,
    );
  }

  async remove(id: string) {
    return this.prisma.knowledgeBase.delete({ where: { id } });
  }
}

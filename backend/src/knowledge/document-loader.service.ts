import { Injectable, Logger } from '@nestjs/common';

export interface DocumentChunk {
  content: string;
  metadata: {
    source: string;
    page?: number;
    chunkIndex: number;
  };
}

@Injectable()
export class DocumentLoaderService {
  private readonly logger = new Logger(DocumentLoaderService.name);

  loadAndChunk(
    filename: string,
    content: Buffer,
    mimeType: string,
  ): DocumentChunk[] {
    const text = this.extractText(content, mimeType);
    return this.chunkText(text, filename);
  }

  private extractText(content: Buffer, mimeType: string): string {
    if (
      mimeType === 'text/plain' ||
      mimeType === 'text/markdown' ||
      mimeType === 'text/csv'
    ) {
      return content.toString('utf-8');
    }
    // For PDF/DOCX, would use LangChain document loaders in production
    return content.toString('utf-8');
  }

  private chunkText(
    text: string,
    source: string,
    chunkSize: number = 1000,
    overlap: number = 200,
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let start = 0;
    let index = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push({
        content: text.slice(start, end),
        metadata: { source, chunkIndex: index },
      });
      start += chunkSize - overlap;
      index++;
    }

    return chunks;
  }
}

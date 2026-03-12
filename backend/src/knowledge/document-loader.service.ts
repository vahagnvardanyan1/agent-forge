import { Injectable, Logger } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';

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

  private readonly splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ['\n\n', '\n', '. ', ' ', ''],
  });

  async loadAndChunk(
    filename: string,
    content: Buffer,
    mimeType: string,
  ): Promise<DocumentChunk[]> {
    const docs = await this.extractDocuments(content, mimeType, filename);
    const splits = await this.splitter.splitDocuments(docs);

    return splits.map((doc, index) => ({
      content: doc.pageContent,
      metadata: {
        source: filename,
        page: doc.metadata.page as number | undefined,
        chunkIndex: index,
      },
    }));
  }

  private async extractDocuments(
    content: Buffer,
    mimeType: string,
    source: string,
  ): Promise<Document[]> {
    if (mimeType === 'application/pdf') {
      return this.loadPdf(content, source);
    }

    const text = content.toString('utf-8');
    return [new Document({ pageContent: text, metadata: { source } })];
  }

  private async loadPdf(content: Buffer, source: string): Promise<Document[]> {
    try {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
      const pdfParseModule = await import('pdf-parse');
      const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;
      const parsed = await pdfParse(content);
      const text: string = parsed.text;
      const numpages: number = parsed.numpages;
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
      return [
        new Document({
          pageContent: text,
          metadata: { source, pages: numpages },
        }),
      ];
    } catch (error) {
      // Fix #17: Return empty document instead of interpreting binary PDF as UTF-8 text
      this.logger.error(
        `Failed to parse PDF "${source}": ${(error as Error).message}`,
      );
      return [
        new Document({
          pageContent: '',
          metadata: { source, parseError: (error as Error).message },
        }),
      ];
    }
  }
}

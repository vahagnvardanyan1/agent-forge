/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { AiProvidersService } from '../../ai-providers/ai-providers.service';
import { KnowledgeService } from '../../knowledge/knowledge.service';

export interface RagInput {
  query: string;
  knowledgeBaseId: string;
  systemPrompt?: string;
  model?: string;
  provider?: string;
  topK?: number;
}

export interface RagOutput {
  answer: string;
  sources: Array<{
    content: string;
    score: number;
    metadata: Record<string, unknown>;
  }>;
  tokensUsed: number;
}

@Injectable()
export class RagRunnable {
  private readonly logger = new Logger(RagRunnable.name);

  constructor(
    private readonly aiProviders: AiProvidersService,
    private readonly knowledgeService: KnowledgeService,
  ) {}

  async invoke(input: RagInput): Promise<RagOutput> {
    this.logger.log(
      `RAG query on knowledge base ${input.knowledgeBaseId}: ${input.query.slice(0, 100)}`,
    );

    const queryResult = await this.knowledgeService.query(
      input.knowledgeBaseId,
      { query: input.query, topK: input.topK ?? 5 },
    );

    const sources = (queryResult.matches ?? []).map((match: any) => ({
      content: (match.metadata?.content as string) ?? '',
      score: match.score ?? 0,
      metadata: (match.metadata as Record<string, unknown>) ?? {},
    }));

    const context = sources.map((s) => s.content).join('\n\n---\n\n');

    if (!context.trim()) {
      return {
        answer:
          'No relevant documents found in the knowledge base for this query.',
        sources: [],
        tokensUsed: 0,
      };
    }

    const providerName = input.provider ?? 'openai';
    const model = this.aiProviders.getProvider(providerName).getChatModel({
      model: input.model,
    });

    const systemPrompt =
      input.systemPrompt ??
      'You are a helpful assistant. Answer the question based on the provided context. If the context does not contain enough information, say so.';

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      [
        'human',
        'Context:\n{context}\n\nQuestion: {query}\n\nAnswer based on the context above:',
      ],
    ]);

    // Fix #5: Invoke model directly to get token metadata
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      context,
      query: input.query,
    });

    const tokensUsed =
      (response.usage_metadata?.input_tokens ?? 0) +
      (response.usage_metadata?.output_tokens ?? 0);

    const answer =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    return {
      answer,
      sources,
      tokensUsed,
    };
  }

  // Fix #6: Real streaming — retrieve docs first, then stream the LLM response
  async *stream(input: RagInput): AsyncGenerator<string> {
    this.logger.log(`RAG stream on knowledge base ${input.knowledgeBaseId}`);

    const queryResult = await this.knowledgeService.query(
      input.knowledgeBaseId,
      { query: input.query, topK: input.topK ?? 5 },
    );

    const sources = (queryResult.matches ?? []).map((match: any) => ({
      content: (match.metadata?.content as string) ?? '',
    }));

    const context = sources.map((s) => s.content).join('\n\n---\n\n');

    if (!context.trim()) {
      yield 'No relevant documents found in the knowledge base for this query.';
      return;
    }

    const providerName = input.provider ?? 'openai';
    const model = this.aiProviders.getProvider(providerName).getChatModel({
      model: input.model,
    });

    const systemPrompt =
      input.systemPrompt ??
      'You are a helpful assistant. Answer the question based on the provided context. If the context does not contain enough information, say so.';

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      [
        'human',
        'Context:\n{context}\n\nQuestion: {query}\n\nAnswer based on the context above:',
      ],
    ]);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const stream = await chain.stream({
      context,
      query: input.query,
    });

    for await (const chunk of stream) {
      yield chunk;
    }
  }
}

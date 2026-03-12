import { Injectable, Logger } from '@nestjs/common';
import { RagRunnable } from './runnables/rag-runnable';
import { ConversationalRunnable } from './runnables/conversational-runnable';
import { RoutedRunnable } from './runnables/routed-runnable';
import { BufferMemory } from './memory/buffer-memory';
import { VectorMemory } from './memory/vector-memory';

@Injectable()
export class LangchainService {
  private readonly logger = new Logger(LangchainService.name);

  constructor(
    private readonly ragRunnable: RagRunnable,
    private readonly conversationalRunnable: ConversationalRunnable,
    private readonly routedRunnable: RoutedRunnable,
    private readonly bufferMemory: BufferMemory,
    private readonly vectorMemory: VectorMemory,
  ) {}

  executeRag(query: string, knowledgeBaseId: string, systemPrompt?: string) {
    this.logger.log(
      `Executing RAG pipeline for knowledge base ${knowledgeBaseId}`,
    );
    return this.ragRunnable.invoke({ query, knowledgeBaseId, systemPrompt });
  }

  executeConversational(
    sessionId: string,
    message: string,
    systemPrompt?: string,
  ) {
    const history = this.bufferMemory.getMessages(sessionId);
    const result = this.conversationalRunnable.invoke({
      message,
      history: history.map((m) => ({ role: m.role, content: m.content })),
      systemPrompt,
    });

    this.bufferMemory.addMessage(sessionId, {
      role: 'user',
      content: message,
    });
    this.bufferMemory.addMessage(sessionId, {
      role: 'assistant',
      content: result.response,
    });

    return result;
  }

  executeRouted(
    message: string,
    routes: Array<{ name: string; description: string; handler: string }>,
  ) {
    return this.routedRunnable.invoke({ message, routes });
  }

  getBufferMemory(): BufferMemory {
    return this.bufferMemory;
  }

  getVectorMemory(): VectorMemory {
    return this.vectorMemory;
  }
}

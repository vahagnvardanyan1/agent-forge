import { Module } from '@nestjs/common';
import { LangchainService } from './langchain.service';
import { RagRunnable } from './runnables/rag-runnable';
import { ConversationalRunnable } from './runnables/conversational-runnable';
import { RoutedRunnable } from './runnables/routed-runnable';
import { GithubTool } from './tools/github-tool';
import { JiraTool } from './tools/jira-tool';
import { ZapierTool } from './tools/zapier-tool';
import { WebSearchTool } from './tools/web-search-tool';
import { CalculatorTool } from './tools/calculator-tool';
import { BufferMemory } from './memory/buffer-memory';
import { VectorMemory } from './memory/vector-memory';

@Module({
  providers: [
    LangchainService,
    RagRunnable,
    ConversationalRunnable,
    RoutedRunnable,
    GithubTool,
    JiraTool,
    ZapierTool,
    WebSearchTool,
    CalculatorTool,
    BufferMemory,
    VectorMemory,
  ],
  exports: [
    LangchainService,
    GithubTool,
    JiraTool,
    ZapierTool,
    WebSearchTool,
    CalculatorTool,
  ],
})
export class LangchainModule {}

import { Module } from '@nestjs/common';
import { AiProvidersModule } from '../ai-providers/ai-providers.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { IntegrationsModule } from '../integrations/integrations.module';
import { LangchainService } from './langchain.service';
import { RagRunnable } from './runnables/rag-runnable';
import { ConversationalRunnable } from './runnables/conversational-runnable';
import { RoutedRunnable } from './runnables/routed-runnable';
import { GithubTool } from './tools/github-tool';
import { JiraTool } from './tools/jira-tool';
import { ZapierTool } from './tools/zapier-tool';
import { WebSearchTool } from './tools/web-search-tool';
import { CalculatorTool } from './tools/calculator-tool';
import { ToolFactoryService } from './tools/tool-factory.service';
import { HttpStepExecutor } from './tools/steps/http-step.executor';
import { LlmStepExecutor } from './tools/steps/llm-step.executor';
import { CodeStepExecutor } from './tools/steps/code-step.executor';
import { KnowledgeSearchStepExecutor } from './tools/steps/knowledge-search-step.executor';
import { TransformStepExecutor } from './tools/steps/transform-step.executor';
import { BufferMemory } from './memory/buffer-memory';
import { VectorMemory } from './memory/vector-memory';

@Module({
  imports: [AiProvidersModule, KnowledgeModule, IntegrationsModule],
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
    ToolFactoryService,
    HttpStepExecutor,
    LlmStepExecutor,
    CodeStepExecutor,
    KnowledgeSearchStepExecutor,
    TransformStepExecutor,
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
    ToolFactoryService,
    BufferMemory,
    VectorMemory,
  ],
})
export class LangchainModule {}

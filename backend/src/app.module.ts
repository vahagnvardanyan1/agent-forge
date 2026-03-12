import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { AiProvidersModule } from './ai-providers/ai-providers.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { LangchainModule } from './langchain/langchain.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { OrchestrationModule } from './orchestration/orchestration.module';
import { ExecutionModule } from './execution/execution.module';
import { BillingModule } from './billing/billing.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    AgentsModule,
    AiProvidersModule,
    KnowledgeModule,
    LangchainModule,
    IntegrationsModule,
    MarketplaceModule,
    WorkflowsModule,
    OrchestrationModule,
    ExecutionModule,
    BillingModule,
    AnalyticsModule,
  ],
})
export class AppModule {}

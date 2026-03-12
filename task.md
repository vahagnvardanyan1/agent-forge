# AgentForge — Full-Stack AI Agent Platform Build Prompt

> **Use this prompt with Claude to scaffold and build the entire AgentForge platform.**

---

## ROLE & CONTEXT

You are a senior full-stack engineer and product architect. You are building **AgentForge** — a production-grade AI agent platform where users can create, configure, test, publish, and monetize AI agents. The platform connects to external services (GitHub, Jira, Vercel, Telegram, Zapier, etc.) and uses vector databases (Pinecone) and orchestration frameworks (LangChain) under the hood.

You must write clean, typed, well-structured code with no shortcuts. Every file must be complete and production-ready.

---

## PROJECT STRUCTURE

The root folder contains ONLY two folders — no root-level config files, no root package.json, no docker-compose at root. Each project is fully self-contained.

```
agentforge/
├── frontend/          # Next.js 15 (App Router) — fully self-contained
└── backend/           # NestJS — fully self-contained (includes docker-compose, Prisma, etc.)
```

There must be NO files at the `agentforge/` root level — only the two folders above. All configs, docker-compose, .gitignore, README, etc. live inside `frontend/` or `backend/` respectively. Each folder is its own independent Git repo with its own package.json, README, .gitignore, and tooling.

---

## TECH STACK — FRONTEND

| Layer | Technology |
|---|---|
| Framework | **Next.js 15** (latest) with App Router, Server Components, Server Actions |
| Language | **TypeScript 5.x** (strict mode) |
| UI Library | **shadcn/ui** (latest, installed via `npx shadcn@latest init`) |
| Styling | **Tailwind CSS 4** (latest) with custom design tokens |
| State | **Zustand 5** (latest, with persist middleware for user prefs, devtools in dev) |
| Flow Editor | **React Flow 12** (@xyflow/react latest) for visual agent builder |
| Icons | **Lucide React** (latest) |
| Forms | **React Hook Form 7** (latest) + **Zod 3** (latest) validation |
| Data Fetching | **TanStack Query v5** (latest) |
| Auth | **Auth.js v5** (next-auth@5 latest — formerly NextAuth.js) |
| Charts | **Recharts 2** (latest) for analytics dashboards |
| Animations | **Motion** (latest — formerly Motion, now `motion` package) |
| Theme | **next-themes** (latest) for dark/light mode toggle |
| Code Editor | **Monaco Editor** (@monaco-editor/react latest) for prompt editing |
| Markdown | **react-markdown** (latest) + **rehype-highlight** (latest) for rendering agent docs |
| Toast/Notify | **Sonner** (latest, shadcn compatible) |
| Tables | **@tanstack/react-table** (latest) for marketplace, logs, agent lists |
| React | **React 19** + **React DOM 19** (latest) |

### Frontend Folder Structure

```
frontend/
├── app/
│   ├── (marketing)/           # Landing, pricing, about — public pages
│   │   ├── page.tsx           # Landing page
│   │   ├── pricing/page.tsx
│   │   ├── about/page.tsx
│   │   └── layout.tsx         # Marketing layout (navbar + footer)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx         # Sidebar + topbar layout
│   │   ├── page.tsx           # Dashboard home / overview
│   │   ├── agents/
│   │   │   ├── page.tsx       # My agents list
│   │   │   ├── new/page.tsx   # Create agent wizard
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Agent detail
│   │   │       ├── edit/page.tsx  # Agent editor
│   │   │       ├── builder/page.tsx # React Flow visual builder
│   │   │       ├── logs/page.tsx  # Execution logs
│   │   │       └── settings/page.tsx
│   │   ├── marketplace/
│   │   │   ├── page.tsx       # Browse agents
│   │   │   └── [id]/page.tsx  # Agent marketplace detail
│   │   ├── integrations/
│   │   │   └── page.tsx       # Connect GitHub, Jira, Vercel, Telegram, Zapier
│   │   ├── knowledge/
│   │   │   ├── page.tsx       # Knowledge bases (Pinecone vector stores)
│   │   │   └── [id]/page.tsx  # Knowledge base detail
│   │   ├── workforce/
│   │   │   ├── page.tsx       # Manage agent teams/workforces
│   │   │   ├── new/page.tsx   # Create new workforce
│   │   │   └── [id]/page.tsx  # Workforce detail + orchestration view
│   │   ├── workflows/
│   │   │   ├── page.tsx       # LangChain workflow templates
│   │   │   └── [id]/page.tsx  # Workflow editor (React Flow)
│   │   ├── analytics/
│   │   │   └── page.tsx       # Usage, costs, performance charts
│   │   └── settings/
│   │       └── page.tsx       # Account, billing, API keys
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── globals.css
│   └── layout.tsx             # Root layout (providers, fonts, theme)
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/
│   │   ├── marketing-navbar.tsx
│   │   ├── marketing-footer.tsx
│   │   ├── dashboard-sidebar.tsx
│   │   ├── dashboard-topbar.tsx
│   │   └── theme-toggle.tsx
│   ├── landing/
│   │   ├── hero-section.tsx
│   │   ├── features-grid.tsx
│   │   ├── integrations-showcase.tsx
│   │   ├── workflow-demo.tsx      # Animated React Flow demo
│   │   ├── pricing-cards.tsx
│   │   ├── testimonials.tsx
│   │   ├── stats-counter.tsx
│   │   └── cta-section.tsx
│   ├── agents/
│   │   ├── agent-avatar.tsx         # DiceBear bottts robot avatar
│   │   ├── agent-card.tsx
│   │   ├── agent-form.tsx
│   │   ├── agent-builder/
│   │   │   ├── builder-canvas.tsx     # React Flow canvas
│   │   │   ├── node-palette.tsx       # Draggable node types
│   │   │   ├── nodes/
│   │   │   │   ├── trigger-node.tsx
│   │   │   │   ├── llm-node.tsx       # Claude/OpenAI/etc
│   │   │   │   ├── tool-node.tsx      # GitHub, Jira, etc
│   │   │   │   ├── condition-node.tsx
│   │   │   │   ├── output-node.tsx
│   │   │   │   ├── knowledge-node.tsx # Pinecone RAG
│   │   │   │   ├── webhook-node.tsx
│   │   │   │   └── zapier-node.tsx
│   │   │   └── edges/
│   │   │       └── animated-edge.tsx
│   │   └── prompt-editor.tsx      # Monaco-based prompt editor
│   ├── marketplace/
│   │   ├── marketplace-grid.tsx
│   │   ├── marketplace-filters.tsx
│   │   └── agent-review.tsx
│   ├── knowledge/
│   │   ├── upload-documents.tsx
│   │   ├── vector-store-stats.tsx
│   │   └── search-test.tsx
│   └── integrations/
│       ├── integration-card.tsx
│       └── oauth-connect-button.tsx
├── lib/
│   ├── api.ts                 # Axios/fetch wrapper for backend
│   ├── auth.ts                # NextAuth config
│   ├── utils.ts               # cn() helper, formatters
│   └── constants.ts
├── stores/
│   ├── use-auth-store.ts
│   ├── use-agent-store.ts
│   ├── use-builder-store.ts   # React Flow state
│   ├── use-theme-store.ts
│   └── use-marketplace-store.ts
├── types/
│   ├── agent.ts
│   ├── integration.ts
│   ├── marketplace.ts
│   ├── knowledge.ts
│   └── workflow.ts
├── hooks/
│   ├── use-agents.ts          # TanStack Query hooks
│   ├── use-marketplace.ts
│   ├── use-integrations.ts
│   └── use-knowledge.ts
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
├── .env.local.example
└── README.md
```

---

## FRONTEND CODING CONVENTIONS (from reference template)

Follow these conventions strictly. They are based on a proven production template (`next-template`).

### Zustand Store Architecture

Use `createWithEqualityFn` from `zustand/traditional` with **slice-based** architecture. Slices hold **state only** — no setters or actions inside slices. Mutations go through `setAppStore()`.

```
src/store/
  index.ts                     # Main store — composes all slices
  slices/
    ui/
      store.ts                 # Slice creator (state only)
      types.ts                 # Interface for this slice
      index.ts                 # Barrel export
    agents/
      store.ts
      types.ts
      index.ts
    builder/
      store.ts
      types.ts
      index.ts
    marketplace/
      store.ts
      types.ts
      index.ts
```

**Main store (`src/store/index.ts`):**
```typescript
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import createUiSlice, { type IUiStore } from "./slices/ui";
import createAgentsSlice, { type IAgentsStore } from "./slices/agents";
import createBuilderSlice, { type IBuilderStore } from "./slices/builder";

export type IAppStore = IUiStore & IAgentsStore & IBuilderStore;

const compare = <T>(a: T, b: T) => a === b || shallow(a, b);

export const useAppStore = createWithEqualityFn<IAppStore>(
  (...args) => ({
    ...createUiSlice(...args),
    ...createAgentsSlice(...args),
    ...createBuilderSlice(...args),
  }),
  compare,
);

export const getAppStore = useAppStore.getState;
export const setAppStore = useAppStore.setState;
```

**Slice example (`src/store/slices/ui/store.ts`):**
```typescript
import type { StateCreator } from "zustand";
import type { IUiStore } from "./types";

const createUiSlice: StateCreator<IUiStore> = () => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
});

export default createUiSlice;
```

**Usage in components — selector OUTSIDE, setAppStore for mutations:**
```typescript
"use client";

import { useAppStore, setAppStore } from "@/store";
import type { IAppStore } from "@/store";

const selector = (store: IAppStore) => ({
  sidebarOpen: store.sidebarOpen,
});

export const Sidebar = () => {
  const { sidebarOpen } = useAppStore(selector);
  return (
    <Sheet open={sidebarOpen} onOpenChange={() => setAppStore({ sidebarOpen: false })}>
      {/* ... */}
    </Sheet>
  );
};
```

### Component Structure

Each component lives in its own directory with 3 files:

```
src/components/
  └── MyComponent/
      ├── MyComponent.tsx      # UI only (presentation)
      ├── styled.tsx           # Styled/composed subcomponents (shadcn wrappers, Tailwind compositions)
      └── index.ts             # Barrel re-export
```

**Rules:**
- Server components by default. Add `"use client"` only for hooks, event handlers, or browser APIs
- Props → define a TypeScript interface. Export it if other components need it
- Styling → keep styled/composed subcomponents in `styled.tsx`
- Store → external selectors outside the component, `setAppStore` for mutations
- One responsibility per file — separate UI, logic, data

### Providers

Providers live in `src/providers/`, each in its own directory:

```
src/providers/
  └── ThemeProvider/
      ├── ThemeProvider.tsx     # "use client" — wraps children with theme context
      └── index.ts             # Barrel export
```

**Root layout composes all providers:**
```typescript
// app/layout.tsx
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html suppressHydrationWarning>
    <body>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </body>
  </html>
);
```

### Hooks

Custom hooks live in `src/hooks/`, each in its own directory:

```
src/hooks/
  └── useMyHook/
      ├── useMyHook.ts         # Hook implementation
      └── index.ts             # Barrel export
```

### Constants & Config

```
src/constants/
  configs.ts                   # BASE_URL, API endpoints, feature flags
  routes.ts                    # Route path constants
```

### Engineering Rules (MUST FOLLOW)

1. **Arguments as objects** — Functions with 2+ args must accept a single object param
2. **DRY** — Extract repeated logic into hooks/utilities. Never duplicate
3. **One responsibility per file** — UI, logic, data in separate files
4. **Clean & declarative** — Small functions, no deep nesting, delegate to helpers
5. **Logic separation** — UI components must NOT contain business logic. State → store, API → services, Validation → utilities, Side effects → hooks
6. **Function expressions only** — `const fn = () => {}`, never `function fn() {}`. Exception: `export default function` for Next.js pages/layouts
7. **Import ordering** — 3 groups with blank lines: (1) Framework (react, next), (2) Third-party, (3) Local (`@/store`, `@/components`, `./styled`)
8. **`import type`** — Always use `import type` for type-only imports
9. **TypeScript strict** — No `any`. Use `unknown` for unknown values. Interfaces for props. Explicit return types for public APIs
10. **Naming** — Components: PascalCase, Hooks: `use` prefix, Constants: UPPER_SNAKE_CASE, Types: PascalCase with `I` prefix for store interfaces, Styled: PascalCase
11. **Performance** — External selectors for Zustand, `next/dynamic` for heavy components, lazy loading with meaningful fallbacks
12. **Barrel exports** — Every directory has `index.ts` that re-exports public API

---

## TECH STACK — BACKEND

| Layer | Technology |
|---|---|
| Framework | **NestJS 11** (latest) |
| Language | **TypeScript 5.x** (strict) |
| ORM | **Prisma 6** (latest) with PostgreSQL |
| Database | **PostgreSQL 17** (latest) |
| Vector DB | **Pinecone** (@pinecone-database/pinecone latest) |
| AI Orchestration | **LangChain.js** (latest — @langchain/core, @langchain/langgraph, @langchain/openai, @langchain/anthropic, @langchain/pinecone, @langchain/community) |
| AI Providers | **Anthropic SDK** (@anthropic-ai/sdk latest), **OpenAI SDK** (openai latest), **Google AI** (@google/generative-ai latest) |
| Auth | **Passport.js** (latest, JWT strategy, OAuth strategies) |
| Validation | **class-validator** (latest) + **class-transformer** (latest) |
| Queue | **BullMQ 5** (latest) with Redis (for async agent execution) |
| WebSocket | **@nestjs/websockets** (latest) + **Socket.IO 4** (latest) for real-time agent streaming |
| File Upload | **Multer** (latest, document upload for knowledge base) |
| Cache | **Redis** via @nestjs/cache-manager (latest) |
| API Docs | **@nestjs/swagger** (latest, Swagger/OpenAPI) |
| Rate Limiting | **@nestjs/throttler** (latest) |
| Logging | **Pino** (latest, pino-pretty for dev) |
| Testing | **Jest** (latest) + **Supertest** (latest) |

### Backend Folder Structure

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── dto/
│   │       └── pagination.dto.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── github-oauth.strategy.ts
│   │   │   └── google-oauth.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       └── update-user.dto.ts
│   ├── agents/
│   │   ├── agents.module.ts
│   │   ├── agents.controller.ts
│   │   ├── agents.service.ts
│   │   ├── agent-executor.service.ts    # Core execution engine
│   │   ├── dto/
│   │   │   ├── create-agent.dto.ts
│   │   │   ├── update-agent.dto.ts
│   │   │   └── execute-agent.dto.ts
│   │   └── entities/
│   │       └── agent.entity.ts
│   ├── marketplace/
│   │   ├── marketplace.module.ts
│   │   ├── marketplace.controller.ts
│   │   ├── marketplace.service.ts
│   │   └── dto/
│   │       ├── publish-agent.dto.ts
│   │       └── review-agent.dto.ts
│   ├── ai-providers/
│   │   ├── ai-providers.module.ts
│   │   ├── ai-providers.service.ts          # Unified multi-provider interface
│   │   ├── providers/
│   │   │   ├── anthropic.provider.ts        # Claude (Opus, Sonnet, Haiku)
│   │   │   ├── openai.provider.ts           # GPT-4o, GPT-4, GPT-3.5
│   │   │   ├── google.provider.ts           # Gemini Pro, Flash
│   │   │   └── base-provider.interface.ts
│   │   └── dto/
│   │       ├── completion.dto.ts
│   │       └── streaming.dto.ts
│   ├── knowledge/
│   │   ├── knowledge.module.ts
│   │   ├── knowledge.controller.ts
│   │   ├── knowledge.service.ts
│   │   ├── pinecone.service.ts              # Pinecone vector operations
│   │   ├── embeddings.service.ts            # Generate embeddings
│   │   ├── document-loader.service.ts       # Parse PDF, DOCX, TXT, CSV
│   │   └── dto/
│   │       ├── create-knowledge-base.dto.ts
│   │       └── query-knowledge.dto.ts
│   ├── langchain/
│   │   ├── langchain.module.ts
│   │   ├── langchain.service.ts             # LCEL Runnable orchestration
│   │   ├── runnables/                        # Modern LCEL runnables (NOT old chain classes)
│   │   │   ├── rag-runnable.ts              # RunnableSequence for RAG
│   │   │   ├── conversational-runnable.ts   # Chat + history via LCEL
│   │   │   └── routed-runnable.ts           # RunnableBranch for routing
│   │   ├── tools/
│   │   │   ├── github-tool.ts               # tool() function wrapper
│   │   │   ├── jira-tool.ts
│   │   │   ├── zapier-tool.ts               # Zapier AI Actions tool
│   │   │   ├── web-search-tool.ts
│   │   │   └── calculator-tool.ts
│   │   └── memory/
│   │       ├── buffer-memory.ts
│   │       └── vector-memory.ts             # Pinecone-backed memory
│   ├── integrations/
│   │   ├── integrations.module.ts
│   │   ├── integrations.controller.ts
│   │   ├── integrations.service.ts
│   │   ├── github/
│   │   │   ├── github.service.ts
│   │   │   └── github.types.ts
│   │   ├── jira/
│   │   │   ├── jira.service.ts
│   │   │   └── jira.types.ts
│   │   ├── vercel/
│   │   │   ├── vercel.service.ts
│   │   │   └── vercel.types.ts
│   │   ├── telegram/
│   │   │   ├── telegram.service.ts          # Bot API integration
│   │   │   └── telegram.types.ts
│   │   ├── zapier/
│   │   │   ├── zapier.service.ts            # Zapier MCP + webhooks integration
│   │   │   └── zapier.types.ts
│   │   ├── slack/
│   │   │   ├── slack.service.ts
│   │   │   └── slack.types.ts
│   │   └── discord/
│   │       ├── discord.service.ts
│   │       └── discord.types.ts
│   ├── workflows/
│   │   ├── workflows.module.ts
│   │   ├── workflows.controller.ts
│   │   ├── workflows.service.ts
│   │   ├── workflow-engine.service.ts       # Executes React Flow graphs
│   │   └── dto/
│   │       ├── create-workflow.dto.ts
│   │       └── execute-workflow.dto.ts
│   ├── orchestration/
│   │   ├── orchestration.module.ts
│   │   ├── orchestration.service.ts         # Multi-agent orchestration engine
│   │   ├── workforce.service.ts             # Agent team/workforce management
│   │   ├── handoff.service.ts               # Agent-to-agent task delegation
│   │   └── dto/
│   │       ├── create-workforce.dto.ts
│   │       └── orchestrate.dto.ts
│   ├── execution/
│   │   ├── execution.module.ts
│   │   ├── execution.service.ts             # Manages runs, logs, metrics
│   │   ├── execution.gateway.ts             # WebSocket for real-time streaming
│   │   └── execution-queue.processor.ts     # BullMQ worker
│   ├── billing/
│   │   ├── billing.module.ts
│   │   ├── billing.controller.ts
│   │   ├── billing.service.ts               # Token counting, usage tracking
│   │   └── stripe.service.ts                # Stripe integration for marketplace
│   └── analytics/
│       ├── analytics.module.ts
│       ├── analytics.controller.ts
│       └── analytics.service.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── package.json
├── .gitignore
├── .env.example
├── Dockerfile
├── README.md
└── docker-compose.yml      # Postgres, Redis, backend service
```

---

## PRISMA SCHEMA

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
  DEVELOPER
}

enum AgentStatus {
  DRAFT
  ACTIVE
  PUBLISHED
  ARCHIVED
}

enum ExecutionStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}

enum AIProvider {
  ANTHROPIC
  OPENAI
  GOOGLE
  CUSTOM
}

enum IntegrationType {
  GITHUB
  JIRA
  VERCEL
  TELEGRAM
  ZAPIER
  SLACK
  DISCORD
  WEBHOOK
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String?
  avatarUrl     String?
  role          Role      @default(USER)

  githubId      String?   @unique
  googleId      String?   @unique

  agents        Agent[]
  executions    Execution[]
  reviews       Review[]
  integrations  UserIntegration[]
  knowledgeBases KnowledgeBase[]
  apiKeys       ApiKey[]
  workforces    Workforce[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Agent {
  id              String       @id @default(cuid())
  name            String
  slug            String       @unique
  description     String
  systemPrompt    String       @db.Text
  avatarSeed      String       @default(cuid())  // Seed for DiceBear bottts avatar
  status          AgentStatus  @default(DRAFT)

  // AI Config
  provider        AIProvider   @default(OPENAI)
  model           String       @default("gpt-4o")
  temperature     Float        @default(0.7)
  maxTokens       Int          @default(4096)

  // Visual Builder
  flowConfig      Json?        // React Flow serialized graph

  // Tools & Integrations
  tools           AgentTool[]

  // Knowledge / RAG
  knowledgeBases  AgentKnowledge[]

  // Marketplace
  isPublished     Boolean      @default(false)
  price           Float?       @default(0)
  category        String?
  tags            String[]
  downloads       Int          @default(0)
  rating          Float        @default(0)
  reviews         Review[]

  // LangChain config
  chainType       String?      // "conversational", "rag", "sequential", "agent"
  memoryType      String?      // "buffer", "vector", "summary"

  // Multi-agent orchestration
  workforces      WorkforceMember[]

  author          User         @relation(fields: [authorId], references: [id])
  authorId        String
  executions      Execution[]

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([authorId])
  @@index([status])
  @@index([isPublished])
}

model AgentTool {
  id          String          @id @default(cuid())
  type        IntegrationType
  config      Json            // Tool-specific configuration

  agent       Agent           @relation(fields: [agentId], references: [id], onDelete: Cascade)
  agentId     String

  @@index([agentId])
}

model KnowledgeBase {
  id          String    @id @default(cuid())
  name        String
  description String?

  // Pinecone (v7: use host-based targeting, NOT environment)
  pineconeIndexHost String    // Host URL from describeIndex() — used for v7 targeting
  pineconeNamespace String
  embeddingModel    String   @default("text-embedding-3-small")
  documentCount     Int      @default(0)
  chunkCount        Int      @default(0)

  documents   Document[]
  agents      AgentKnowledge[]

  owner       User      @relation(fields: [ownerId], references: [id])
  ownerId     String

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([ownerId])
}

model Document {
  id              String    @id @default(cuid())
  filename        String
  mimeType        String
  sizeBytes       Int
  chunkCount      Int       @default(0)
  storageUrl      String

  knowledgeBase   KnowledgeBase @relation(fields: [knowledgeBaseId], references: [id], onDelete: Cascade)
  knowledgeBaseId String

  createdAt       DateTime  @default(now())

  @@index([knowledgeBaseId])
}

model AgentKnowledge {
  agent           Agent         @relation(fields: [agentId], references: [id], onDelete: Cascade)
  agentId         String
  knowledgeBase   KnowledgeBase @relation(fields: [knowledgeBaseId], references: [id])
  knowledgeBaseId String

  @@id([agentId, knowledgeBaseId])
}

model UserIntegration {
  id            String          @id @default(cuid())
  type          IntegrationType
  accessToken   String          @db.Text
  refreshToken  String?         @db.Text
  expiresAt     DateTime?
  metadata      Json?           // workspace, org, bot token, etc.

  user          User            @relation(fields: [userId], references: [id])
  userId        String

  @@unique([userId, type])
  @@index([userId])
}

model Execution {
  id          String          @id @default(cuid())
  status      ExecutionStatus @default(PENDING)

  input       Json
  output      Json?
  error       String?

  // Metrics
  tokensUsed  Int?
  costUsd     Float?
  durationMs  Int?
  steps       Json?           // Array of execution steps for tracing

  agent       Agent           @relation(fields: [agentId], references: [id])
  agentId     String
  user        User            @relation(fields: [userId], references: [id])
  userId      String

  createdAt   DateTime        @default(now())
  completedAt DateTime?

  @@index([agentId])
  @@index([userId])
  @@index([createdAt])
}

model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1-5
  comment   String?

  agent     Agent    @relation(fields: [agentId], references: [id], onDelete: Cascade)
  agentId   String
  user      User     @relation(fields: [userId], references: [id])
  userId    String

  createdAt DateTime @default(now())

  @@unique([agentId, userId])
}

model ApiKey {
  id        String   @id @default(cuid())
  name      String
  keyHash   String   @unique
  prefix    String   // First 8 chars for display "af_xxxx..."
  lastUsed  DateTime?

  user      User     @relation(fields: [userId], references: [id])
  userId    String

  createdAt DateTime @default(now())

  @@index([userId])
}

model Workflow {
  id          String   @id @default(cuid())
  name        String
  description String?
  flowConfig  Json     // React Flow serialized graph
  isTemplate  Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Workforce {
  id          String   @id @default(cuid())
  name        String
  description String?

  // Orchestration config
  handoffStrategy  String   @default("sequential")  // "sequential", "parallel", "conditional", "manager"
  managerAgentId   String?  // If strategy is "manager", this agent coordinates others
  config           Json?    // Additional orchestration rules

  members     WorkforceMember[]
  owner       User     @relation(fields: [ownerId], references: [id])
  ownerId     String

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([ownerId])
}

model WorkforceMember {
  id          String   @id @default(cuid())
  role        String   // "researcher", "writer", "reviewer", etc.
  priority    Int      @default(0)  // Execution order for sequential strategies

  agent       Agent    @relation(fields: [agentId], references: [id])
  agentId     String
  workforce   Workforce @relation(fields: [workforceId], references: [id], onDelete: Cascade)
  workforceId String

  @@unique([agentId, workforceId])
  @@index([workforceId])
}
```

---

## LANDING PAGE DESIGN SPECIFICATION

**Design philosophy**: Clean, premium, Vercel/Linear-inspired. NOT a generic AI landing page with gradient blobs and robot illustrations. Think: precise typography, generous whitespace, subtle micro-interactions, real product screenshots, dark surfaces with accent highlights.

### Color System (CSS Variables via Tailwind)

```
Light Mode:
  --background: 0 0% 100%
  --foreground: 240 10% 3.9%
  --card: 0 0% 100%
  --primary: 262 83% 58%        # Purple accent (#7C3AED)
  --primary-foreground: 0 0% 100%
  --secondary: 240 4.8% 95.9%
  --muted: 240 4.8% 95.9%
  --accent: 175 80% 40%         # Teal secondary (#0D9488)
  --border: 240 5.9% 90%

Dark Mode:
  --background: 240 10% 3.9%    # Near-black
  --foreground: 0 0% 98%
  --card: 240 10% 6%
  --primary: 262 83% 65%        # Brighter purple in dark
  --secondary: 240 3.7% 15.9%
  --muted: 240 3.7% 15.9%
  --accent: 175 80% 50%
  --border: 240 3.7% 15.9%
```

### Typography
- Font: **Inter** (body) + **JetBrains Mono** (code/technical)
- Hero title: `text-6xl lg:text-8xl font-bold tracking-tight`
- Section headings: `text-4xl lg:text-5xl font-semibold tracking-tight`
- Body: `text-lg text-muted-foreground leading-relaxed`

### Hero Section
- Full viewport height
- Title: "Build AI Agents That Actually Work" (or similar — commanding, not fluffy)
- Subtitle: One sentence about what the platform does
- Two CTAs: "Start Building — Free" (primary), "View Documentation" (secondary/outline)
- Below: Animated product preview — a React Flow mini-demo showing agent nodes connecting with animated edges. Use Motion (formerly Motion) for entry animations (stagger children, fade up)
- Background: Subtle dot grid pattern (not gradients), optionally with a faint radial glow behind the product preview

### Features Grid Section
- 2x3 or 3x3 grid of feature cards
- Each card: icon (Lucide), title, 1-2 line description
- Cards have subtle border, hover lift effect (translate-y, shadow)
- Features to highlight:
  1. **Visual Agent Builder** — Drag-and-drop flow editor (React Flow)
  2. **Multi-Model AI** — Claude, GPT-4, Gemini in one place
  3. **Knowledge Base (RAG)** — Pinecone-powered document intelligence
  4. **LangChain Workflows** — Chain complex reasoning and tool use
  5. **Marketplace** — Publish and monetize your agents
  6. **Integrations** — GitHub, Jira, Vercel, Telegram, Zapier, Slack, Discord
  7. **Real-time Execution** — WebSocket streaming with full traceability
  8. **API Access** — REST API + webhooks for headless agent deployment
  9. **Zapier Automation** — Connect 8,000+ apps to your agents via MCP
  10. **Multi-Agent Orchestration** — Agents can delegate tasks to other agents, forming AI teams
  11. **Agent Workforce** — Manage teams of specialized agents that collaborate on complex tasks

### Integrations Showcase Section
- Row of integration logos/icons that auto-scroll (marquee-style or static grid)
- Logos: GitHub, Jira, Vercel, Telegram, Zapier, Slack, Discord, Notion, Pinecone, LangChain
- Below logos: "Connect your stack in minutes, not days"

### Live Workflow Demo Section
- Embedded React Flow read-only canvas showing an example agent workflow:
  - Trigger Node (Webhook) → LLM Node (GPT-4o) → Tool Node (GitHub: Create PR) → Condition Node → Output Node
- Nodes should be visually styled to match the app theme
- Animated edges pulsing to simulate data flow
- Caption: "Design complex AI workflows visually"

### Stats/Social Proof Section
- Animated counters: "10K+ Agents Created", "500+ Published", "50M+ Tokens Processed"
- Use Motion `useInView` + counter animation
- Optional: Logos of companies using the platform (placeholder)

### Pricing Cards Section
- 3-tier pricing: Free / Pro ($29/mo) / Enterprise (Custom)
- Card design: center card (Pro) is highlighted with primary border + "Popular" badge
- Feature comparison list in each card
- shadcn/ui Card component with custom styling

### Testimonial Section
- Horizontal scroll or 3-column grid
- Each testimonial: Avatar, name, role, company, quote
- Subtle quote marks, clean card design

### CTA Section
- Dark background (in light mode) or gradient card
- "Ready to build your first agent?"
- Email input + "Get Started" button
- Or simple: Two buttons — "Start Free" / "Talk to Sales"

### Footer
- 4-column link grid: Product, Resources, Company, Legal
- Bottom row: Logo, copyright, social icons (GitHub, Twitter/X, Discord)
- Minimal, clean

### Animations (Motion)
- All sections: fade-in + slide-up on scroll (useInView)
- Hero elements: Staggered entry (0.1s delay between children)
- Feature cards: Stagger + scale on hover
- Stats: Number count-up animation
- Navigation: Backdrop blur on scroll

### Navbar (Marketing)
- Sticky top, transparent → blur background on scroll
- Logo left, nav links center, "Sign In" + "Get Started" right
- Mobile: hamburger → slide-in drawer
- Dark/light mode toggle button (Sun/Moon icon)

---

## DASHBOARD DESIGN SPECIFICATIONS

### Sidebar
- Collapsible, icon-only when collapsed
- Sections: Overview, My Agents, Builder, Marketplace, Knowledge, Workflows, Integrations, Analytics, Settings
- Active state: primary background, bold text
- User avatar + name at bottom

### Agent Builder (React Flow Page)
- Left panel: Node palette (draggable nodes categorized: Triggers, AI Models, Tools, Logic, Output)
- Center: React Flow canvas with snap-to-grid, minimap, controls
- Right panel: Node configuration form (appears on node click)
- Top toolbar: Save, Run, Publish, Undo/Redo, Zoom controls
- Custom node designs:
  - **Trigger nodes**: Blue accent, lightning bolt icon
  - **LLM nodes**: Purple accent, brain icon — shows provider logo (OpenAI/Anthropic/Google)
  - **Tool nodes**: Teal accent, wrench icon — shows integration logo
  - **Knowledge nodes**: Amber accent, database icon — Pinecone RAG
  - **Condition nodes**: Yellow accent, git-branch icon
  - **Output nodes**: Green accent, send icon
  - **Zapier nodes**: Orange accent, zap icon

### Marketplace Page
- Filter sidebar: Category, Price (Free/Paid), Rating, Provider, Tags
- Grid of agent cards: Name, author, rating stars, download count, price badge, tags
- Featured/trending row at top
- Search bar with debounced search

### Agent Avatars (DiceBear Bottts)

Every agent has a unique robot avatar generated via **DiceBear Bottts** API. These robot avatars give each agent a distinct visual identity across the platform.

**API URL pattern:**
```
https://api.dicebear.com/9.x/bottts/svg?seed={agent.avatarSeed}
```

**Implementation — `agent-avatar.tsx` component:**
```typescript
interface AgentAvatarProps {
  seed: string;
  size?: number;       // px, default 48
  className?: string;
}

// Renders as <img> with the DiceBear bottts SVG URL
// The seed is stored in Agent.avatarSeed (Prisma) and auto-generated on creation
// Users can click to "re-roll" their avatar (generates new random seed)
```

**Where agent avatars appear:**
- **Agent cards** (My Agents list, Marketplace grid) — 48x48 robot avatar next to agent name
- **Agent detail page** — large 96x96 avatar in the header
- **Agent builder** — small avatar in the top toolbar
- **Marketplace listing** — avatar + agent name + author
- **Execution logs** — small avatar identifying which agent ran
- **Dashboard overview** — recent agents with avatars

**Avatar behavior:**
- Auto-generated on agent creation using `cuid()` as seed (ensures unique robot per agent)
- Users can click "Regenerate Avatar" button to randomize (generates new `cuid()` seed, updates DB)
- The `seed` parameter in the URL produces a deterministic robot — same seed = same robot every time
- Use `<img>` tag (NOT `<Image>` from Next.js) for external DiceBear URLs, or use `next.config.ts` `images.remotePatterns` to allow `api.dicebear.com`
- Add `loading="lazy"` for avatar images in list views
- Fallback: if DiceBear is unreachable, show a colored circle with agent initials (like GitHub default avatars)

**Optional DiceBear customization params** (append to URL):
```
?seed={seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf
&backgroundType=gradientLinear
```
These add soft pastel gradient backgrounds behind the robots, matching the platform's professional aesthetic.

---

## KEY INTEGRATION SPECIFICATIONS

### GitHub Integration
- OAuth App flow for user authentication
- Service methods: `listRepos()`, `createIssue()`, `createPR()`, `getFileContents()`, `triggerWorkflow()`
- Use as LangChain tool: agents can read repos, create issues, review PRs
- Webhook receiver for event-triggered agents

### Jira Integration
- OAuth 2.0 (3LO) flow
- Service methods: `getIssues()`, `createIssue()`, `transitionIssue()`, `addComment()`, `getBoards()`
- LangChain tool: agents can manage tickets, update sprints
- Webhook for issue change triggers

### Vercel Integration
- OAuth integration
- Service methods: `listProjects()`, `triggerDeploy()`, `getDeploymentStatus()`, `getEnvVars()`
- Agents can trigger deploys, check status, manage env vars

### Telegram Integration
- Bot API via @telegraf/telegraf or direct HTTP
- Service methods: `sendMessage()`, `setWebhook()`, `handleUpdate()`
- Users can deploy agents as Telegram bots
- Real-time message handling → agent execution → reply

### Zapier Integration
Zapier NLA (Natural Language Actions) is deprecated. The modern integration uses two approaches:

**A. Zapier MCP (for AI agents — primary approach):**
- **Zapier MCP** (Model Context Protocol) connects AI agents to 8,000+ apps and 40,000+ actions
- Package: `zapier-mcp` (actively maintained, official Zapier repo)
- Agents can call Zapier actions via MCP tool interface
- Supports: triggers, actions, searches across all Zapier-connected apps

**B. Zapier Platform SDK (for webhook triggers):**
- **Webhook triggers** (Zapier → AgentForge): Register REST Hook endpoints that Zapier POSTs to
- Your NestJS backend exposes webhook endpoints; Zapier calls them on events
- Auth: OAuth 2.0, API key, or custom auth depending on the connected app

**C. Direct API integration (outgoing actions):**
- Use Axios/fetch to call Zapier webhook URLs or Zapier-connected app APIs
- No single "Zapier API" endpoint for consumption — you build integrations FOR Zapier or receive webhooks FROM Zapier

**Service methods:**
- `registerWebhook(targetUrl)` — Register REST Hook endpoint for Zapier triggers
- `handleWebhookPayload(payload)` — Process incoming Zapier trigger data
- `triggerZapierWebhook(webhookUrl, data)` — Send data to a Zapier catch hook
- `listMcpActions()` — List available Zapier actions via MCP
- `executeMcpAction(actionId, params)` — Execute a Zapier action via MCP

**Auth:** User's Zapier OAuth token stored in `UserIntegration`
**LangChain tool wrapper:** Wraps Zapier MCP actions as LangChain tools for agent use

### Slack Integration
- OAuth V2 flow, Bot token
- Service methods: `sendMessage()`, `createChannel()`, `getMessages()`
- Slash commands → agent execution
- Event subscriptions for trigger-based agents

### Discord Integration
- Bot OAuth2 flow
- Service methods: `sendMessage()`, `createThread()`, `handleCommand()`
- Slash commands for agent interaction

---

## PINECONE + KNOWLEDGE BASE SPECIFICATIONS

**Package:** `@pinecone-database/pinecone` (v7.x latest)
**IMPORTANT:** Pinecone v7 has breaking changes from v6. Follow v7 API patterns below.

### Pinecone Client Initialization (v7)
```typescript
import { Pinecone } from '@pinecone-database/pinecone';

// Auth: only PINECONE_API_KEY needed (PINECONE_ENVIRONMENT is DEPRECATED for serverless)
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
// OR auto-reads PINECONE_API_KEY env var:
const pc = new Pinecone();
```

### Index Targeting (v7 breaking change)
```typescript
// v7: Must use host-based targeting, NOT string name
const indexModel = await pc.describeIndex('agentforge-knowledge');
const index = pc.index({ host: indexModel.host });
```

### Vector Operations (v7 — all use object-shaped args)
```typescript
// Upsert
await index.upsert({
  records: [{ id: 'chunk-1', values: [0.1, 0.2, ...], metadata: { source: 'doc.pdf', page: 1 } }],
  namespace: 'user-kb-123' // optional
});

// Query
const results = await index.query({
  vector: [0.1, 0.2, ...],
  topK: 5,
  includeMetadata: true,
  filter: { source: { $eq: 'doc.pdf' } },
  namespace: 'user-kb-123' // optional
});

// Delete
await index.deleteMany({ ids: ['chunk-1', 'chunk-2'], namespace: 'user-kb-123' });
// OR delete by filter
await index.deleteMany({ filter: { source: 'doc.pdf' }, namespace: 'user-kb-123' });

// Fetch
await index.fetch({ ids: ['chunk-1'], namespace: 'user-kb-123' });
```

### Creating Serverless Indexes
```typescript
await pc.createIndex({
  name: 'agentforge-knowledge',
  dimension: 1536, // OpenAI text-embedding-3-small
  metric: 'cosine',
  spec: { serverless: { cloud: 'aws', region: 'us-east-1' } }
});
```

### Document Ingestion Pipeline
1. User uploads file (PDF, DOCX, TXT, CSV, MD)
2. `document-loader.service.ts` parses file → raw text chunks (using LangChain document loaders)
3. `embeddings.service.ts` generates embeddings via OpenAI `text-embedding-3-small` (dimension 1536)
4. `pinecone.service.ts` upserts vectors with metadata (source, page, chunk_index) using v7 object API
5. Stored in user's knowledge base namespace

### RAG Query Pipeline
1. User query → embed query via OpenAI embeddings
2. Pinecone similarity search (topK=5, with metadata filter) via v7 query API
3. Retrieved chunks → inject into LLM context
4. LangChain RAG runnable produces answer with source citations

### Pinecone Service Methods (wrapping v7 SDK)
- `createIndex(name, dimension, metric, cloud, region)` — creates serverless index
- `getIndex(name)` — returns index handle via host-based targeting
- `upsertVectors(indexHost, namespace, records[])` — v7 object args
- `query(indexHost, namespace, vector, topK, filter?)` — v7 object args
- `deleteVectors(indexHost, namespace, ids[])` — v7 object args
- `deleteByFilter(indexHost, namespace, filter)` — v7 metadata filter delete
- `describeIndex(name)` — stats, host, vector count

---

## LANGCHAIN ORCHESTRATION SPECIFICATIONS

**Packages (all latest):**
- `@langchain/core` — Base abstractions: Runnables, prompts, output parsers, messages
- `@langchain/langgraph` — **Modern agent framework** (replaces AgentExecutor): state machines, multi-agent orchestration, checkpointing, human-in-the-loop
- `@langchain/openai` — OpenAI LLM + embeddings (PRIMARY — user has OpenAI key)
- `@langchain/anthropic` — Claude integration (future, when user adds key)
- `@langchain/pinecone` — Pinecone vector store integration
- `@langchain/community` — Community integrations (tools, document loaders, etc.)

**IMPORTANT:** Use the modern **LCEL (LangChain Expression Language)** and **Runnable** API. The old chain classes (`SequentialChain`, `ConversationalRetrievalChain`, `RouterChain`) are DEPRECATED. Use `RunnableSequence`, `RunnablePassthrough`, `RunnableBranch`, and the `.pipe()` operator instead.

### Modern Runnable Patterns (LCEL)

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';

// 1. Simple chain (replaces SequentialChain)
const chain = ChatPromptTemplate.fromMessages([...])
  .pipe(new ChatOpenAI({ model: 'gpt-4o' }))
  .pipe(new StringOutputParser());

// 2. RAG chain (replaces ConversationalRetrievalChain)
const ragChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
  ragPrompt,
  llm,
  new StringOutputParser(),
]);

// 3. Branching/routing (replaces RouterChain)
import { RunnableBranch } from '@langchain/core/runnables';
const routedChain = RunnableBranch.from([
  [condition1, chain1],
  [condition2, chain2],
  defaultChain,
]);
```

### Agent with Tools (LangGraph — recommended modern approach)
```typescript
// LangGraph is now the RECOMMENDED approach for agents (replaces AgentExecutor)
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';

const llm = new ChatOpenAI({ model: 'gpt-4o', temperature: 0 });
const agent = createReactAgent({ llm, tools });
const result = await agent.invoke({ messages: [{ role: 'user', content: 'Create a GitHub issue...' }] });

// LangGraph also supports: checkpointing, human-in-the-loop, multi-agent orchestration
// For multi-agent workflows, use LangGraph's StateGraph to coordinate agent handoffs
```

**NOTE:** `createOpenAIToolsAgent` + `AgentExecutor` from `langchain/agents` still works but is considered legacy. Use **LangGraph** (`@langchain/langgraph`) for all new agent implementations.

### LangChain Tool Wrappers (modern `tool()` function)
Each integration becomes a LangChain-compatible tool:
```typescript
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// Modern approach: use the `tool()` function
const githubCreateIssueTool = tool(
  async ({ repo, title, body, labels }) => {
    return await githubService.createIssue({ repo, title, body, labels });
  },
  {
    name: 'github_create_issue',
    description: 'Creates a GitHub issue in a repository',
    schema: z.object({
      repo: z.string().describe('Repository in owner/repo format'),
      title: z.string().describe('Issue title'),
      body: z.string().describe('Issue body/description'),
      labels: z.array(z.string()).optional().describe('Labels to add'),
    }),
  }
);

// OR use DynamicStructuredTool for class-based approach
import { DynamicStructuredTool } from '@langchain/core/tools';

const jiraTool = new DynamicStructuredTool({
  name: 'jira_create_issue',
  description: 'Creates a Jira issue',
  schema: z.object({ project: z.string(), summary: z.string(), type: z.string() }),
  func: async (input) => jiraService.createIssue(input),
});
```

### Memory Options
- **BufferMemory** — Keep last N messages in context (via `@langchain/core` message history)
- **Pinecone Vector Memory** — Long-term memory backed by Pinecone via `@langchain/pinecone` VectorStore
- **Conversation Summary** — LLM-summarized history for long conversations

### Pinecone as LangChain Vector Store
```typescript
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone();
const indexModel = await pc.describeIndex('agentforge-knowledge');
const pineconeIndex = pc.index({ host: indexModel.host });

const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings({ model: 'text-embedding-3-small' }),
  { pineconeIndex, namespace: 'user-kb-123' }
);
const retriever = vectorStore.asRetriever({ k: 5 });
```

---

## MULTI-PROVIDER AI SERVICE

**OpenAI is the DEFAULT and PRIMARY provider.** The architecture supports multiple providers, but Phase 1 only requires OpenAI to be fully implemented. Anthropic and Google are optional providers to add later when the user has those API keys.

```typescript
// Unified interface all providers implement
interface AIProvider {
  id: string;
  name: string;
  models: ModelInfo[];
  isConfigured(): boolean;                    // Check if API key is set

  complete(params: CompletionParams): Promise<CompletionResult>;
  stream(params: CompletionParams): AsyncIterable<StreamChunk>;
  countTokens(text: string): Promise<number>;
}

// CompletionParams
interface CompletionParams {
  model: string;
  messages: Message[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
  stream?: boolean;
}
```

### Supported Providers & Models
- **OpenAI** (PRIMARY — default): gpt-4o, gpt-4o-mini, gpt-4-turbo, o1, o1-mini
- **Anthropic** (optional — requires ANTHROPIC_API_KEY): claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5-20251001
- **Google** (optional — requires GOOGLE_AI_API_KEY): gemini-2.0-flash, gemini-2.0-pro

### Embeddings
- **OpenAI** `text-embedding-3-small` (dimension 1536) — used for all Pinecone knowledge base embeddings
- This is the ONLY embedding model needed for Phase 1

---

## MULTI-AGENT ORCHESTRATION (Relevance AI-style)

A key feature inspired by Relevance AI: agents can delegate tasks to other agents, forming **AI workforces** that collaborate on complex tasks.

### Orchestration Strategies
1. **Sequential** — Agents execute in order; output of Agent A becomes input of Agent B
2. **Parallel** — Multiple agents work simultaneously; results are merged
3. **Conditional** — A router decides which agent handles the task based on input classification
4. **Manager** — A "manager agent" coordinates sub-agents, decides who does what, aggregates results

### Implementation (LangGraph-powered)
```typescript
// Multi-agent orchestration via LangGraph StateGraph
import { StateGraph, START, END } from '@langchain/langgraph';

const workflow = new StateGraph({ channels: { messages: [], currentAgent: '' } })
  .addNode('researcher', researcherAgent)
  .addNode('writer', writerAgent)
  .addNode('reviewer', reviewerAgent)
  .addEdge(START, 'researcher')
  .addEdge('researcher', 'writer')
  .addEdge('writer', 'reviewer')
  .addConditionalEdges('reviewer', shouldRevise, { revise: 'writer', approve: END });

const team = workflow.compile();
const result = await team.invoke({ messages: [userRequest] });
```

### Workforce UI
- Workforce page: Create and manage agent teams
- Visual orchestration view (React Flow): Shows agents as nodes, handoff arrows as edges
- Each workforce member has a role label and priority
- Live execution trace: See which agent is currently active, what it's producing
- Handoff logs: Full trace of agent-to-agent delegation

### Agent-to-Agent Delegation
- Any agent can "call" another agent as a tool (via LangChain tool wrapper)
- Manager agents use `createReactAgent` from LangGraph with sub-agents as tools
- Handoff metadata tracked in `Execution.steps[]` for full traceability

---

## WORKFLOW ENGINE (React Flow → Execution)

The visual graph created in React Flow is serialized as JSON and stored in `Agent.flowConfig` or `Workflow.flowConfig`. The backend `workflow-engine.service.ts` deserializes and executes it:

1. Parse flow JSON → build execution DAG
2. Find trigger node → start execution
3. Traverse edges, execute each node:
   - **LLM Node**: Call ai-providers service with configured model
   - **Tool Node**: Call respective integration service
   - **Knowledge Node**: Run Pinecone RAG query
   - **Condition Node**: Evaluate expression, choose branch
   - **Zapier Node**: Trigger Zapier action via MCP or webhook
   - **Output Node**: Return final result
4. Each step logged to Execution.steps[]
5. Stream progress via WebSocket

---

## DOCKER COMPOSE

Each project has its own `docker-compose.yml`. There is NO root-level docker-compose.

### backend/docker-compose.yml
```yaml
version: "3.9"
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: agentforge
      POSTGRES_USER: agentforge
      POSTGRES_PASSWORD: ${DB_PASSWORD:-agentforge_dev}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: .
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis
    env_file:
      - .env
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  pgdata:
```

---

## ENV VARIABLES

### Backend (.env)
```
DATABASE_URL=postgresql://agentforge:password@localhost:5432/agentforge
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# AI Providers (OpenAI is PRIMARY — required for Phase 1)
OPENAI_API_KEY=sk-...                    # REQUIRED — used for LLM + embeddings
ANTHROPIC_API_KEY=                        # Optional — add later for Claude support
GOOGLE_AI_API_KEY=                        # Optional — add later for Gemini support

# Pinecone (v7 — only API key needed, PINECONE_ENVIRONMENT is DEPRECATED)
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=agentforge-knowledge  # Index name (host resolved via describeIndex)

# Integrations
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
JIRA_CLIENT_ID=...
JIRA_CLIENT_SECRET=...
VERCEL_CLIENT_ID=...
VERCEL_CLIENT_SECRET=...
TELEGRAM_BOT_TOKEN=...
ZAPIER_CLIENT_ID=...                      # Zapier OAuth app credentials
ZAPIER_CLIENT_SECRET=...
SLACK_CLIENT_ID=...
SLACK_CLIENT_SECRET=...
SLACK_SIGNING_SECRET=...
DISCORD_BOT_TOKEN=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...

# Stripe (Marketplace billing)
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

# App
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=AgentForge
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## EXECUTION INSTRUCTIONS

When building this project, follow this order:

### Phase 1 — Scaffold
1. Create root `agentforge/` folder with ONLY two subfolders: `frontend/` and `backend/` — NO files at root level
2. Create `frontend/` via `npx create-next-app@latest` (Next.js 15, React 19, Tailwind CSS 4) with TypeScript, App Router, src=no — include its own .gitignore, README.md (NO Docker for frontend)
3. Create `backend/` via `@nestjs/cli` with strict TypeScript — include its own .gitignore, README.md, Dockerfile, docker-compose.yml
4. Install all dependencies listed in tech stacks above in their respective folders
5. Set up shadcn/ui in frontend (`npx shadcn@latest init`)
6. Configure Tailwind theme with design tokens above
7. Set up Prisma in backend, create schema, generate client
8. Set up backend/docker-compose.yml (Postgres + Redis + backend service)

### Phase 2 — Backend Core
1. Build auth module (JWT + OAuth strategies)
2. Build users module
3. Build agents module (CRUD + execution)
4. Build ai-providers module (OpenAI as PRIMARY default, Anthropic + Google as optional stubs)
5. Build knowledge module (Pinecone v7 + OpenAI embeddings + document loading)
6. Build langchain module (chains, tools, memory)
7. Build integrations module (GitHub, Jira, Vercel, Telegram, Zapier, Slack, Discord)
8. Build marketplace module
9. Build workflows module + engine
10. Build orchestration module (multi-agent workforce, LangGraph StateGraph, handoffs)
11. Build execution module (BullMQ + WebSocket)
11. Build billing module (Stripe)
12. Build analytics module
13. Set up Swagger docs

### Phase 3 — Frontend Core
1. Set up providers (theme, auth, query client, zustand stores)
2. Build marketing layout (navbar, footer) + landing page (all sections)
3. Build auth pages (login, register)
4. Build dashboard layout (sidebar, topbar)
5. Build agents CRUD pages
6. Build agent builder page (React Flow + custom nodes + node palette)
7. Build marketplace pages (browse, detail, publish)
8. Build knowledge base pages (upload, manage, test)
9. Build workflows page (React Flow editor)
10. Build integrations page (OAuth connect cards)
11. Build analytics page (Recharts charts)
12. Build settings page

### Phase 4 — Polish
1. Add Motion animations to landing page
2. Ensure dark/light mode works perfectly everywhere
3. Add loading skeletons (shadcn Skeleton)
4. Add error boundaries
5. Mobile responsive pass on all pages
6. Add proper SEO meta tags

---

## IMPORTANT IMPLEMENTATION NOTES

1. **Every file must be complete** — no `// TODO` stubs, no `...` placeholders. Write full implementations.
2. **Type everything** — no `any` types. Create proper interfaces in the `types/` folder.
3. **Use barrel exports** — `index.ts` files in each module for clean imports.
4. **Error handling** — NestJS exception filters on backend, error boundaries + toast notifications on frontend.
5. **Responsive design** — Mobile-first Tailwind classes on every component.
6. **Accessibility** — Proper ARIA labels, keyboard navigation, focus management (shadcn handles most of this).
7. **Dark mode** — Use `dark:` Tailwind prefix systematically. All custom colors must have dark variants via CSS variables.
8. **React Flow** — Use `@xyflow/react` v12 (latest), not the old `reactflow` package. Custom nodes extend `NodeProps`. Use `useNodesState` and `useEdgesState` hooks.
9. **Zustand stores** — Use Zustand 5 API. Use slices pattern for complex stores. Persist user preferences. Use `devtools` middleware in development.
10. **API calls** — All frontend API calls go through TanStack Query hooks wrapping the `lib/api.ts` client. Never call fetch directly in components.
11. **LangChain + LangGraph** — Use the latest @langchain/* scoped packages (@langchain/core, @langchain/langgraph, @langchain/openai, @langchain/pinecone, @langchain/community). Use modern LCEL (LangChain Expression Language) with `RunnableSequence`, `.pipe()`, `RunnablePassthrough`, `RunnableBranch`. Use **LangGraph** (`@langchain/langgraph`) for agent execution and multi-agent orchestration (replaces `AgentExecutor`). Do NOT use deprecated chain classes (`SequentialChain`, `ConversationalRetrievalChain`, `RouterChain`). Use `tool()` function from `@langchain/core/tools` for creating tools.
12. **Pinecone** — Use `@pinecone-database/pinecone` v7+. Use serverless indexes (not pod-based). Use host-based index targeting (`pc.index({ host })` not string names). All vector operations use object-shaped arguments. `PINECONE_ENVIRONMENT` is DEPRECATED — only `PINECONE_API_KEY` needed. Default dimension 1536 for OpenAI `text-embedding-3-small`.
13. **Tailwind CSS 4** — Use the new CSS-first configuration (no tailwind.config.ts needed in v4; use `@theme` directive in CSS). If the project scaffolds with v4, follow v4 conventions.
14. **Motion** — Use `motion` package (not the old `framer-motion`). Import from `"motion/react"` for React components.
15. **All packages must be latest versions** — When running `npm install`, do NOT pin to old versions. Always use `@latest` tag or omit version to get the newest stable release.
16. **Zapier** — Zapier NLA is DEPRECATED. Use **Zapier MCP** (Model Context Protocol) for AI agent integration + REST Hooks for webhook triggers. No single consumption API — integrate via MCP for agent actions, expose webhook endpoints for incoming Zapier triggers, use Axios for outgoing webhook calls. Auth via OAuth 2.0.
17. **Default AI provider** — OpenAI is the ONLY required provider for Phase 1. All LLM calls default to `gpt-4o`, all embeddings use `text-embedding-3-small`. Anthropic and Google providers should be implemented as stubs that check `isConfigured()` and return graceful errors if no API key is set.
18. **Open source first** — Prefer well-maintained open-source libraries, plugins, and community packages wherever possible. Use open-source skills, plugins, tools, and utilities from npm, GitHub, and the broader ecosystem. Do NOT reinvent what already exists — if there's a battle-tested open-source solution (document parsers, queue adapters, auth helpers, UI primitives, etc.), use it. Check npm weekly downloads and GitHub stars to gauge quality. This includes: open-source LangChain community tools, shadcn/ui community components, Tailwind plugins, React Flow community nodes, NestJS community modules, Prisma extensions, and any other open-source package that accelerates development and reduces custom code.

---

## OPEN SOURCE PACKAGES & PLUGINS TO USE

Leverage these open-source packages and plugins throughout the project. Do not build custom solutions when these exist:

### Frontend Open Source
- **shadcn/ui** — All UI primitives (button, card, dialog, sheet, dropdown, tabs, etc.). Install every component needed via `npx shadcn@latest add [component]`
- **@xyflow/react** — React Flow for visual builders (open source, MIT license)
- **cmdk** — Command palette (⌘K) for quick agent search, navigation — use shadcn's `<Command>` wrapper
- **vaul** — Drawer component for mobile — use shadcn's `<Drawer>` wrapper
- **input-otp** — OTP input for 2FA — use shadcn's `<InputOTP>` wrapper
- **embla-carousel-react** — Carousel for testimonials, marketplace featured — use shadcn's `<Carousel>` wrapper
- **react-day-picker** — Date pickers for analytics filters — use shadcn's `<Calendar>` wrapper
- **react-resizable-panels** — Resizable panels for the agent builder (palette | canvas | config)
- **@dnd-kit/core** + **@dnd-kit/sortable** — Drag and drop for node palette in agent builder
- **react-syntax-highlighter** or **shiki** — Syntax highlighting in code blocks and prompt previews
- **nuqs** — Type-safe URL search params for Next.js (marketplace filters, pagination state)
- **next-safe-action** — Type-safe server actions with validation
- **uploadthing** or **react-dropzone** — File upload UI for knowledge base document uploads
- **react-hot-toast** or **sonner** — Toast notifications (sonner is shadcn default)
- **@formkit/auto-animate** — Auto-animate list transitions (agent list, marketplace grid)
- **zustand-middleware-yjs** — Optional: real-time collaborative editing if multiplayer is added later

### Backend Open Source
- **@nestjs/bull** or **bullmq** — Job queues for async agent execution (open source, MIT)
- **@nestjs/swagger** — Auto-generate OpenAPI docs from decorators
- **@nestjs/throttler** — Rate limiting
- **@nestjs/cache-manager** + **cache-manager-redis-yet** — Redis caching
- **nestjs-pino** — Structured logging with Pino
- **helmet** — HTTP security headers
- **compression** — Gzip response compression
- **@nestjs/event-emitter** — Internal event bus for decoupled module communication
- **@nestjs/schedule** — Cron jobs (e.g., cleanup old executions, usage aggregation)
- **@langchain/langgraph** — Modern agent framework: state graphs, multi-agent orchestration, checkpointing, human-in-the-loop. Use for ALL agent execution (replaces AgentExecutor)
- **langchain** community tools — Use `@langchain/community` for pre-built tool wrappers (web search, calculator, Wikipedia, etc.) instead of writing custom ones
- **zapier-mcp** — Zapier MCP integration for connecting agents to 8,000+ apps via Model Context Protocol
- **pdf-parse** — Parse PDF documents for knowledge base ingestion
- **mammoth** — Parse DOCX documents for knowledge base ingestion
- **csv-parse** — Parse CSV files for knowledge base ingestion
- **uuid** — Generate UUIDs for API keys, execution IDs
- **bcrypt** or **argon2** — Password hashing
- **jsonwebtoken** — JWT signing/verification (used via Passport)
- **nodemailer** — Email sending (welcome emails, notifications)
- **sharp** — Image processing (resize avatars, thumbnails if needed)
- **cuid2** — Collision-resistant unique IDs (for Prisma default IDs)
- **slugify** — Generate URL-safe slugs for agents
- **sanitize-html** — Sanitize user-generated content (agent descriptions, reviews)
- **@octokit/rest** — GitHub REST API client (official, open source) — use instead of raw HTTP
- **jira.js** or **jira-client** — Jira REST API client (community open source)
- **telegraf** — Telegram Bot framework (open source, well-maintained)
- **@slack/web-api** + **@slack/events-api** — Official Slack SDK (open source)
- **discord.js** — Discord bot framework (open source, very popular)

### Dev Tooling (Open Source)
- **eslint** + **@typescript-eslint** — Linting for both frontend and backend
- **prettier** — Code formatting
- **husky** + **lint-staged** — Pre-commit hooks
- **vitest** or **jest** — Unit testing
- **playwright** or **cypress** — E2E testing (optional, Phase 4+)
- **docker** + **docker-compose** — Containerized local dev
- **turborepo** — Optional: if monorepo tooling is needed later

### Key Principle
When you need functionality, ALWAYS search npm first for an open-source package before writing custom code. Prefer packages with: 1000+ GitHub stars, active maintenance (commits in last 3 months), TypeScript support, and MIT/Apache-2.0 license. If a community plugin exists for shadcn/ui, React Flow, NestJS, or LangChain that solves your need — use it.

---

## START BUILDING

Begin with Phase 1 scaffold. Create every file listed in the folder structures above. Then proceed through Phases 2-4 sequentially. Use open-source packages from the list above wherever applicable. Ask me if anything is ambiguous.

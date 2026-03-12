# AgentForge

An AI agent platform for building, deploying, and orchestrating autonomous AI agents with tool-calling, RAG (Retrieval-Augmented Generation), multi-agent workflows, and a marketplace.

Built with **NestJS** + **LangChain.js** + **LangGraph** on the backend, and **Next.js 16** + **React 19** on the frontend.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [LangChain Integration](#langchain-integration)
  - [Hybrid Approach](#hybrid-approach)
  - [Agent Execution Loop](#agent-execution-loop)
  - [Tools](#tools)
  - [RAG Pipeline](#rag-pipeline)
  - [Runnables (LCEL Chains)](#runnables-lcel-chains)
  - [Memory](#memory)
  - [Workflow Engine (LangGraph)](#workflow-engine-langgraph)
  - [Multi-Agent Orchestration (LangGraph)](#multi-agent-orchestration-langgraph)
- [AI Providers](#ai-providers)
- [Security](#security)
- [Testing the Integration](#testing-the-integration)
- [Database Schema](#database-schema)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  React 19 · TailwindCSS · shadcn/ui · React Query       │
│  Visual Agent Builder (xyflow) · Monaco Editor           │
└──────────────────────┬──────────────────────────────────┘
                       │ REST + WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                    NestJS Backend                         │
│                                                          │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────┐     │
│  │   Auth   │  │   Agents   │  │   LangChain      │     │
│  │  JWT/OAuth│  │  CRUD +    │  │  Runnables       │     │
│  └──────────┘  │  Executor  │  │  Tools            │     │
│                │            │  │  Memory           │     │
│  ┌──────────┐  └─────┬──────┘  └────────┬─────────┘     │
│  │Knowledge │        │                   │               │
│  │ RAG +    │◄───────┘                   │               │
│  │ Pinecone │                            │               │
│  └──────────┘        ┌───────────────────┘               │
│                      │                                   │
│  ┌──────────┐  ┌─────▼──────┐  ┌──────────────────┐     │
│  │Workflows │  │AI Providers│  │  Integrations     │     │
│  │LangGraph │  │OpenAI      │  │  GitHub · Jira    │     │
│  │StateGraph│  │Anthropic   │  │  Slack · Discord   │     │
│  └──────────┘  │Google      │  │  Telegram · Zapier │     │
│                └────────────┘  └──────────────────┘     │
│                                                          │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────┐     │
│  │Execution │  │ Billing    │  │  Analytics        │     │
│  │WebSocket │  │ Stripe     │  │  Token Tracking   │     │
│  │+ Queue   │  └────────────┘  └──────────────────┘     │
│  └──────────┘                                            │
│                                                          │
│  PostgreSQL (Prisma) ──── Pinecone (Vectors)             │
└──────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TailwindCSS 4, shadcn/ui, React Query, Zustand, xyflow (visual builder), Monaco Editor |
| **Backend** | NestJS 11, TypeScript, Prisma ORM, PostgreSQL |
| **AI/LLM** | LangChain.js, LangGraph, OpenAI SDK, Anthropic SDK, Google Generative AI |
| **Vector DB** | Pinecone |
| **Auth** | JWT, Passport.js, Google OAuth |
| **Real-time** | Socket.io (WebSocket) |
| **Queue** | BullMQ |
| **Billing** | Stripe |
| **Integrations** | GitHub (Octokit), Jira, Slack, Discord, Telegram, Zapier |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL running locally
- (Optional) Pinecone account for RAG
- (Optional) OpenAI API key for agent execution

### Setup

```bash
# 1. Clone the repo
git clone <repo-url> && cd agent-forge

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials (see Environment Variables below)

# 4. Create database and push schema
cd backend
npx prisma db push

# 5. Start both servers
# Terminal 1 — Backend (port 4000)
cd backend && npm run start:dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

Open **http://localhost:3000** in your browser.

Swagger API docs: **http://localhost:4000/api/docs**

---

## Environment Variables

Create `backend/.env`:

```env
# Database (required)
DATABASE_URL="postgresql://<user>@localhost:5432/agentforge?schema=public"

# JWT (required)
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# App
PORT=4000
FRONTEND_URL="http://localhost:3000"

# OpenAI (required for agent execution)
OPENAI_API_KEY=sk-...

# Optional — other providers
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...

# Optional — Pinecone (for RAG)
PINECONE_API_KEY=...
PINECONE_INDEX_HOST=...

# Optional — integrations
SERP_API_KEY=...
GITHUB_TOKEN=...
STRIPE_SECRET_KEY=...

# Optional — conversation memory cleanup
CONVERSATION_TTL_DAYS=30
```

---

## Project Structure

```
agent-forge/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma           # Database models & enums
│   └── src/
│       ├── agents/                  # Agent CRUD + execution
│       │   ├── agent-executor.service.ts   # LangChain tool-calling loop
│       │   ├── agents.controller.ts
│       │   └── agents.service.ts
│       ├── ai-providers/            # Multi-provider abstraction
│       │   └── providers/
│       │       ├── base-provider.interface.ts
│       │       ├── openai.provider.ts
│       │       ├── anthropic.provider.ts
│       │       └── google.provider.ts
│       ├── auth/                    # JWT + Google OAuth
│       ├── knowledge/               # RAG pipeline
│       │   ├── document-loader.service.ts   # LangChain text splitter
│       │   ├── embeddings.service.ts        # LangChain embeddings
│       │   ├── pinecone.service.ts
│       │   └── knowledge.service.ts
│       ├── langchain/               # LangChain integration layer
│       │   ├── runnables/
│       │   │   ├── conversational-runnable.ts   # LCEL chat chain
│       │   │   ├── rag-runnable.ts              # LCEL RAG chain
│       │   │   └── routed-runnable.ts           # Structured output routing
│       │   ├── tools/
│       │   │   ├── calculator-tool.ts    # Safe math (no eval)
│       │   │   ├── github-tool.ts        # GitHub API tool
│       │   │   ├── jira-tool.ts          # Jira API tool
│       │   │   ├── web-search-tool.ts    # SerpAPI search
│       │   │   └── zapier-tool.ts        # Zapier webhook tool
│       │   ├── memory/
│       │   │   ├── buffer-memory.ts      # Prisma-backed conversation memory
│       │   │   └── vector-memory.ts      # Pinecone-backed semantic memory
│       │   └── utils/
│       │       └── input-sanitizer.ts    # Prompt injection detection
│       ├── workflows/               # LangGraph workflow engine
│       │   └── workflow-engine.service.ts
│       ├── orchestration/           # LangGraph multi-agent
│       │   ├── orchestration.service.ts
│       │   └── handoff.service.ts
│       ├── execution/               # WebSocket + job queue
│       │   ├── execution.gateway.ts
│       │   └── execution-queue.processor.ts
│       ├── integrations/            # Third-party service clients
│       ├── marketplace/             # Agent marketplace
│       ├── billing/                 # Stripe billing
│       └── analytics/               # Usage analytics
│
└── frontend/
    └── src/
        ├── app/
        │   ├── (auth)/              # Login, Register
        │   ├── (marketing)/         # Landing, Pricing, About
        │   └── dashboard/
        │       ├── agents/          # Agent list, create, detail, execute
        │       ├── knowledge/       # Knowledge base management
        │       ├── workflows/       # Workflow management
        │       ├── workforce/       # Multi-agent teams
        │       ├── marketplace/     # Agent marketplace
        │       ├── integrations/    # Third-party connections
        │       ├── analytics/       # Usage dashboard
        │       └── settings/        # User settings
        ├── components/
        │   ├── ui/                  # shadcn/ui components
        │   ├── agents/              # Agent form, card, execute dialog, builder
        │   ├── knowledge/           # Upload, search, vector stats
        │   ├── landing/             # Marketing components
        │   └── layout/              # Sidebar, topbar, navbar
        ├── hooks/                   # React Query hooks (use-agents, etc.)
        ├── lib/                     # Axios client, auth, utils
        ├── store/                   # Zustand state management
        └── types/                   # TypeScript interfaces
```

---

## API Reference

All endpoints are prefixed with `/api`. Responses are wrapped in `{ data, statusCode, timestamp }`.

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | - | Register with email/password |
| POST | `/auth/login` | - | Login, returns JWT token |
| GET | `/auth/me` | JWT | Get current user |
| GET | `/auth/google` | - | Initiate Google OAuth |
| GET | `/auth/google/callback` | - | OAuth callback |

### Agents
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/agents` | JWT | Create agent |
| GET | `/agents` | JWT | List user's agents |
| GET | `/agents/:id` | JWT | Get agent detail |
| PATCH | `/agents/:id` | JWT | Update agent |
| DELETE | `/agents/:id` | JWT | Delete agent |
| POST | `/agents/:id/execute` | JWT | **Execute agent** (calls LLM) |

**Execute Agent** request body:
```json
{
  "input": "What is the weather today?",
  "context": {}
}
```

Response:
```json
{
  "data": {
    "id": "exec_123",
    "status": "COMPLETED",
    "output": { "response": "I don't have access to weather data..." },
    "tokensUsed": 176,
    "costUsd": 0.000038,
    "durationMs": 1796,
    "steps": [
      { "type": "llm", "output": "...", "durationMs": 1791 }
    ]
  }
}
```

### Knowledge
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/knowledge` | JWT | Create knowledge base |
| GET | `/knowledge` | JWT | List knowledge bases |
| GET | `/knowledge/:id` | JWT | Get knowledge base |
| POST | `/knowledge/:id/upload` | JWT | Upload document (multipart) |
| POST | `/knowledge/:id/query` | JWT | Query with RAG |
| DELETE | `/knowledge/:id` | JWT | Delete knowledge base |

### Workflows
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/workflows` | JWT | Create workflow |
| GET | `/workflows` | JWT | List workflows |
| GET | `/workflows/:id` | JWT | Get workflow |
| POST | `/workflows/:id/execute` | JWT | Execute workflow (LangGraph) |
| DELETE | `/workflows/:id` | JWT | Delete workflow |

### Marketplace
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/marketplace` | - | Browse agents |
| GET | `/marketplace/:id` | - | Get agent detail |
| POST | `/marketplace/publish` | JWT | Publish agent |
| POST | `/marketplace/:id/reviews` | JWT | Add review |

### Integrations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/integrations/available` | JWT | List available types |
| GET | `/integrations` | JWT | List user integrations |
| POST | `/integrations` | JWT | Create integration |
| POST | `/integrations/:id/test` | JWT | Test connection |
| DELETE | `/integrations/:id` | JWT | Delete integration |

### Billing
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/billing/plans` | - | List plans |
| GET | `/billing/subscription` | JWT | Current subscription |
| POST | `/billing/checkout` | JWT | Create checkout session |
| POST | `/billing/cancel` | JWT | Cancel subscription |
| GET | `/billing/usage` | JWT | Current usage |

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/analytics/dashboard` | JWT | Dashboard stats |
| GET | `/analytics/agents/:id` | JWT | Agent analytics |
| GET | `/analytics/tokens` | JWT | Token usage |

---

## LangChain Integration

### Hybrid Approach

AgentForge uses a **hybrid** strategy for AI integration:

| Operation | Method | Why |
|-----------|--------|-----|
| Agent execution (tool-calling loop) | LangChain `ChatModel.bindTools()` + `invoke()` | Need tool-calling protocol, structured output, token tracking via `usage_metadata` |
| RAG chains | LangChain LCEL (`prompt.pipe(model).pipe(parser)`) | Composable chain abstraction |
| Document loading & chunking | LangChain `RecursiveCharacterTextSplitter` | Intelligent boundary-aware splitting |
| Embeddings | LangChain `OpenAIEmbeddings` | Consistent interface with caching |
| Workflows | LangGraph `StateGraph` | Graph-based execution with state management |
| Multi-agent orchestration | LangGraph `StateGraph` | Sequential, parallel, and adaptive strategies |
| Simple completions / streaming | Direct SDK (`openai`, `@anthropic-ai/sdk`) | Better performance, reliable token tracking (LangChain streaming has a [known bug](https://github.com/langchain-ai/langchainjs/issues/7876) where `usage_metadata` is undefined) |

The bridge between the two is `getChatModel()` on each AI provider — it returns a LangChain `BaseChatModel` for use in chains and agents, while `complete()` and `streamComplete()` use the native SDK.

### Agent Execution Loop

The core agent executor (`agent-executor.service.ts`) implements a manual tool-calling loop instead of `createReactAgent`:

```
1. Load agent config from DB (provider, model, tools, knowledge bases)
2. Get LangChain model via provider.getChatModel()
3. Bind tools: model.bindTools(resolvedTools)
4. Build messages: [SystemMessage, HumanMessage]
5. LOOP (max 10 iterations):
   a. response = await model.invoke(messages)     ← LangChain invoke
   b. Track tokens from response.usage_metadata
   c. If no tool_calls → break (final answer)
   d. For each tool_call:
      - Execute tool with 30s timeout
      - Track consecutive failures (disable after 3)
      - Add ToolMessage to messages
      - Emit WebSocket status update
   e. Continue loop
6. Save execution record (output, tokensUsed, costUsd, steps, durationMs)
```

**Why manual loop instead of `createReactAgent`:**
- Per-step cost tracking for billing
- WebSocket status updates during tool execution
- Per-agent customization (different providers/models/temperatures)
- Configurable recursion limit and timeouts

### Tools

All tools use LangChain's `tool()` function with **Zod schemas** for input validation:

| Tool | Description | Zod Schema |
|------|-------------|------------|
| **Calculator** | Safe math evaluation (custom recursive-descent parser, no `eval`) | `{ expression: string }` |
| **GitHub** | Create issues, list issues, create PRs, get repo info | `{ action: enum, repo: string, params?: object }` |
| **Jira** | Create/update/search/transition issues | `{ action: enum, projectKey?: string, issueKey?: string, params?: object }` |
| **Web Search** | SerpAPI web search | `{ query: string, maxResults?: number }` |
| **Zapier** | Trigger zaps, list zaps | `{ action: enum, zapId?: string, payload?: object }` |

Tools receive credentials from the user's integration records (not hardcoded):
```
Agent Tool Config → User Integration (DB) → Tool Credentials
```

### RAG Pipeline

```
Document Upload:
  File → DocumentLoaderService.loadAndChunk()
       → RecursiveCharacterTextSplitter (1000 chars, 200 overlap)
       → EmbeddingsService.generateBatchEmbeddings()
       → OpenAIEmbeddings.embedDocuments()
       → PineconeService.upsertVectors()

Query:
  Question → EmbeddingsService.generateEmbedding()
           → PineconeService.query() (top-K similarity search)
           → Build context from retrieved docs
           → ChatPromptTemplate + context + question
           → model.invoke() → answer with sources
```

**Supported formats:** Plain text, Markdown, PDF (via `pdf-parse`), CSV, DOCX

**Chunking strategy:** `RecursiveCharacterTextSplitter` splits at natural boundaries (paragraphs → sentences → words) rather than arbitrary character positions.

### Runnables (LCEL Chains)

Three pre-built chains using LangChain Expression Language:

**ConversationalRunnable** — Chat with history:
```typescript
const prompt = ChatPromptTemplate.fromMessages([
  ['system', systemPrompt],
  new MessagesPlaceholder('history'),
  ['human', '{input}'],
]);
// invoke(): prompt → model → AIMessage (preserves usage_metadata)
// stream(): prompt → model → StringOutputParser → async chunks
```

**RAGRunnable** — Retrieval-augmented generation:
```typescript
// 1. Retrieve docs from Pinecone via KnowledgeService.query()
// 2. Build context string from results
// 3. prompt.pipe(model) → answer with sources + token usage
```

**RoutedRunnable** — LLM-based message routing:
```typescript
const schema = z.object({
  selectedRoute: z.string(),
  confidence: z.number(),
  reasoning: z.string(),
});
// model.withStructuredOutput(schema) → route selection
```

### Memory

**BufferMemory** — Conversation history stored in PostgreSQL:
- Backed by Prisma `ConversationMessage` model (not an in-memory Map)
- Retrieves most recent N messages per session
- Daily cron cleanup of messages older than `CONVERSATION_TTL_DAYS` (default 30)

**VectorMemory** — Semantic memory via Pinecone:
- Stores entries with OpenAI embeddings
- `searchByText()` for similarity search
- Namespaced per agent/session

### Workflow Engine (LangGraph)

Workflows are executed as LangGraph `StateGraph` instances:

```typescript
const WorkflowState = Annotation.Root({
  input: Annotation<string>(),
  currentOutput: Annotation<string>({ reducer: (_, v) => v }),
  nodeResults: Annotation<NodeResult[]>({
    reducer: (curr, update) => [...curr, ...update],
  }),
});

// Dynamic graph construction:
// 1. Add node for each workflow step
// 2. Wire edges (including conditional routing)
// 3. Compile and invoke
```

**Node types:** `llm` (invoke AI model), `condition` (branching logic), `knowledge` (RAG query), `tool` (tool execution)

### Multi-Agent Orchestration (LangGraph)

Four orchestration strategies:

| Strategy | Implementation | Use Case |
|----------|---------------|----------|
| **SEQUENTIAL** | LangGraph StateGraph — agents chained in order, each gets previous output | Pipeline processing |
| **PARALLEL** | `Promise.all()` — all agents run simultaneously | Independent subtasks |
| **ADAPTIVE** | Supervisor agent selects best worker based on input | Dynamic task routing |
| **ROUND_ROBIN** | Not yet implemented | Load balancing |

The supervisor in ADAPTIVE mode uses the manager agent's provider/model for consistency.

---

## AI Providers

The `AiProvidersService` factory returns the correct provider by name:

| Provider | LangChain Class | Models |
|----------|----------------|--------|
| **OpenAI** | `ChatOpenAI` | gpt-4o, gpt-4o-mini, gpt-4-turbo |
| **Anthropic** | `ChatAnthropic` | claude-opus-4-20250514, claude-sonnet-4-20250514 |
| **Google** | `ChatGoogleGenerativeAI` | gemini-pro, gemini-1.5-flash |

Each provider exposes:
- `complete(messages, options)` — Direct SDK, single response
- `streamComplete(messages, options)` — Direct SDK, async generator
- `getChatModel(params)` — Returns cached LangChain `BaseChatModel` for chains/agents
- `listModels()` — Available model names

ChatModel instances are cached by `(model, temperature, maxTokens)` tuple to avoid re-instantiation.

### Cost Tracking

Token usage tracked per execution with split input/output rates:

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |
| gpt-4-turbo | $10.00 | $30.00 |
| claude-sonnet-4 | $3.00 | $15.00 |
| claude-opus-4 | $15.00 | $75.00 |
| gemini-pro | $0.25 | $0.50 |

---

## Security

- **Prompt injection detection** — 12 regex patterns catch common injection attempts (`input-sanitizer.ts`)
- **Input wrapping** — User input enclosed in `<user_input>` XML tags to separate from system instructions
- **Safe math parser** — Custom recursive-descent parser for calculator (no `eval()` or `Function()`)
- **Tool failure circuit breaker** — Tools disabled after 3 consecutive failures
- **Timeouts** — LLM calls: 120s, Tool calls: 30s
- **Recursion limit** — Max 10 iterations in the agent loop
- **Credential isolation** — Tool credentials resolved per-user from integration records
- **Rate limiting** — 100 requests per 60 seconds (Throttler)
- **Helmet** — Security headers
- **CORS** — Restricted to `FRONTEND_URL` origin
- **JWT** — Bearer token auth on all protected endpoints

---

## Testing the Integration

### Verify LangChain is active

The agent executor logs each LangChain operation. After executing an agent, check the backend console for:

```
[AgentExecutorService] [LangChain] Creating ChatModel via getChatModel() — provider=openai, model=gpt-4o-mini
[AgentExecutorService] [LangChain] ChatModel class: ChatOpenAI
[AgentExecutorService] [LangChain] Resolved 1 tools: [calculator]
[AgentExecutorService] [LangChain] Tools bound to model via bindTools()
[AgentExecutorService] [LangChain] Iteration 1/10 — calling model.invoke() with 2 messages
[AgentExecutorService] [LangChain] Model response — tool_calls: 1, usage: {"input_tokens":95,"output_tokens":20}
[AgentExecutorService] [LangChain] Executing tool "calculator" with args: {"expression":"15 * 7 + 23"}
[AgentExecutorService] [LangChain] Tool "calculator" returned: 128
[AgentExecutorService] [LangChain] Iteration 2/10 — calling model.invoke() with 5 messages
[AgentExecutorService] [LangChain] Model response — tool_calls: 0, usage: {"input_tokens":130,"output_tokens":25}
```

### Quick test via curl

```bash
# 1. Register
curl -s -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"Test1234","name":"Tester"}'

# 2. Login (save the token)
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"Test1234"}' | jq -r '.data.token // .token')

# 3. Create an agent
AGENT_ID=$(curl -s -X POST http://localhost:4000/api/agents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Math Helper",
    "description": "An agent that solves math problems",
    "systemPrompt": "You are a math assistant. Use the calculator tool for arithmetic. Show your work.",
    "provider": "OPENAI",
    "model": "gpt-4o-mini",
    "temperature": 0,
    "maxTokens": 512
  }' | jq -r '.data.id // .id')

echo "Agent ID: $AGENT_ID"

# 4. Execute — test tool-calling (LangChain bindTools + tool loop)
curl -s -X POST "http://localhost:4000/api/agents/$AGENT_ID/execute" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"input": "What is 147 * 83 + 592?"}' | jq .
```

Expected response shows:
- `status: "COMPLETED"` — execution succeeded
- `steps` array with `type: "tool"` entries — proves LangChain tool-calling worked
- `tokensUsed > 0` — proves `usage_metadata` tracking works
- `costUsd > 0` — proves cost estimation works
- `durationMs` — total execution time

### What to look for in steps

A tool-calling execution produces multiple steps:

```json
{
  "steps": [
    { "type": "tool", "name": "calculator", "input": {"expression": "147 * 83 + 592"}, "output": "12793", "durationMs": 5 },
    { "type": "llm", "output": "147 × 83 + 592 = 12,793", "durationMs": 800 }
  ]
}
```

- **`type: "tool"`** — LangChain executed a tool via the tool-calling protocol
- **`type: "llm"`** — Final LLM response (no more tool calls)

If the agent answers without tool steps, it means the LLM chose not to use tools. Try a more explicit math prompt like `"Calculate 147 * 83 + 592 using the calculator tool"`.

### Test via UI

1. Open **http://localhost:3000/login** and sign in
2. Go to **My Agents** → **New Agent**
3. Create an agent with system prompt: `"You are a math assistant. Always use the calculator tool for arithmetic."`
4. Set model to **GPT-4o Mini**, temperature to **0**
5. Save, then click **Execute** on the agent detail page
6. Send: `"What is 15 * 7 + 23?"` — observe the response with token/cost/duration metadata

---

## Database Schema

### Core Models

| Model | Description |
|-------|-------------|
| **User** | Accounts with JWT/OAuth auth, roles (USER, ADMIN, DEVELOPER) |
| **Agent** | AI agent config — provider, model, system prompt, temperature, tools, knowledge bases |
| **AgentTool** | Tool bindings per agent (type + config JSON) |
| **KnowledgeBase** | RAG knowledge base — Pinecone index, namespace, embedding model |
| **Document** | Uploaded files per knowledge base |
| **Execution** | Agent execution records — input, output, tokens, cost, steps, duration |
| **Workflow** | Workflow definitions (node graph as JSON) |
| **Workforce** | Multi-agent teams with handoff strategies |
| **WorkforceMember** | Agent membership in workforce with role and priority |
| **UserIntegration** | OAuth tokens for third-party services (GitHub, Jira, etc.) |
| **ConversationMessage** | Buffer memory — sessionId-indexed message history |

### Key Enums

| Enum | Values |
|------|--------|
| `AIProvider` | OPENAI, ANTHROPIC, GOOGLE, CUSTOM |
| `AgentStatus` | DRAFT, ACTIVE, PUBLISHED, ARCHIVED |
| `ExecutionStatus` | PENDING, RUNNING, COMPLETED, FAILED, CANCELLED |
| `IntegrationType` | GITHUB, JIRA, VERCEL, TELEGRAM, ZAPIER, SLACK, DISCORD, WEBHOOK |
| `Role` | USER, ADMIN, DEVELOPER |

---

## Package Version Notes

- All `@langchain/*` packages are pinned to exact versions (no `^`) to prevent version conflicts
- All must resolve to the **same `@langchain/core`** — verify with `npm ls @langchain/core`
- Uses **Zod v3** (not v4) — Zod v4 breaks `withStructuredOutput()` ([Issue #8357](https://github.com/langchain-ai/langchainjs/issues/8357))
- Update all `@langchain/*` packages together, never individually

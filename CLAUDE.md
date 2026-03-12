# CLAUDE.md — AgentForge

Project context and conventions for Claude Code.

## Project Overview

AgentForge is an AI agent platform. Users create agents (with system prompts, tools, knowledge bases), execute them via LangChain.js, and manage them through a dashboard. The backend is NestJS + Prisma + PostgreSQL. The frontend is Next.js 16 + React 19.

## Repo Layout

```
agent-forge/
├── backend/          # NestJS API (port 4000)
├── frontend/         # Next.js app (port 3000)
└── package.json      # Root — runs both via `npm run dev`
```

## Quick Commands

```bash
# Run both servers
npm run dev

# Backend only
cd backend && npm run start:dev

# Frontend only
cd frontend && npm run dev

# Build
npm run build                          # both
cd backend && npm run build            # backend only (nest build)
cd frontend && npm run build           # frontend only (next build)

# Lint
cd backend && npm run lint             # ESLint + Prettier (auto-fix)
cd frontend && npm run lint            # ESLint

# Database
cd backend && npx prisma db push       # push schema to DB (no migration)
cd backend && npx prisma migrate dev   # create migration
cd backend && npx prisma studio        # visual DB browser
cd backend && npx prisma generate      # regenerate client after schema change

# Tests
cd backend && npm test                 # Jest
cd backend && npm run test:e2e         # E2E tests
```

## Tech Stack

- **Backend**: NestJS 11, TypeScript, Prisma ORM, PostgreSQL
- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS 4, shadcn/ui (base-ui), Zustand, React Query
- **AI**: LangChain.js + LangGraph + direct SDKs (OpenAI, Anthropic, Google)
- **Vector DB**: Pinecone
- **Real-time**: Socket.io WebSocket
- **Queue**: BullMQ
- **Auth**: JWT + Google OAuth (Passport.js)

## Architecture Decisions

### Hybrid AI approach
- **LangChain** for: tool-calling loops (`bindTools` + `invoke`), LCEL chains (RAG, conversational, routing), document chunking (`RecursiveCharacterTextSplitter`), embeddings (`OpenAIEmbeddings`), workflows/orchestration (LangGraph `StateGraph`)
- **Direct SDK** for: simple completions and streaming — LangChain streaming has a [known bug](https://github.com/langchain-ai/langchainjs/issues/7876) where `usage_metadata` is undefined
- The bridge is `getChatModel()` on each AI provider — returns a cached `BaseChatModel` for LangChain chains

### Manual tool-calling loop (not createReactAgent)
The agent executor in `backend/src/agents/agent-executor.service.ts` uses a manual loop because we need per-step cost tracking, WebSocket status updates, and per-agent provider customization.

### Zod v3 (not v4)
Zod v4 breaks `withStructuredOutput()` — [Issue #8357](https://github.com/langchain-ai/langchainjs/issues/8357). The backend pins `zod@3`.

### LangChain package pinning
All `@langchain/*` packages are pinned to exact versions (no `^`). They must all resolve to the same `@langchain/core`. Verify with: `cd backend && npm ls @langchain/core`

## Backend Conventions

### Module structure
Each NestJS module follows: `module.ts`, `controller.ts`, `service.ts`, `dto/`, optionally `entities/`. All controllers are prefixed with `/api` (set in `main.ts`).

### Response wrapping
All responses are wrapped by `TransformInterceptor`: `{ data, statusCode, timestamp }`. The frontend `unwrap()` function in `hooks/use-agents.ts` handles this.

### Error handling
- `PrismaExceptionFilter` catches Prisma errors → proper HTTP codes (503 for DB down, 409 for unique constraint, 404 for not found)
- `HttpExceptionFilter` catches HTTP exceptions
- `ValidationPipe` with `whitelist: true, transform: true`

### AI Providers
`AiProvidersService.getProvider(name)` returns the correct provider. Each provider implements `IAIProvider`:
- `complete()` / `streamComplete()` — direct SDK
- `getChatModel()` — returns cached LangChain `BaseChatModel`
- `listModels()` — available models

ChatModel instances are cached by `(model, temperature, maxTokens)` key.

### Database
- Prisma schema: `backend/prisma/schema.prisma`
- Key enums: `AIProvider` (OPENAI, ANTHROPIC, GOOGLE, CUSTOM), `AgentStatus`, `ExecutionStatus`, `IntegrationType`
- After schema changes: `npx prisma db push` (dev) or `npx prisma migrate dev` (with migration)

### TypeScript config
- Backend: `module: "nodenext"`, `target: "ES2023"`, `strictNullChecks: true`
- ESLint: `@typescript-eslint/no-explicit-any: off`, unused vars prefixed with `_` are allowed
- Prettier: auto end-of-line

## Frontend Conventions

### App Router structure
- `(auth)/` — login, register (no sidebar)
- `(marketing)/` — landing, pricing, about (marketing navbar)
- `dashboard/` — protected routes (sidebar + topbar), wrapped in `AuthProvider`

### Auth flow
- `AuthProvider` validates JWT on mount via `GET /api/auth/me`
- Token stored in `localStorage`
- Axios interceptor clears token on 401, AuthProvider handles redirect
- `useAuth()` hook provides `{ isAuthenticated, user, logout }`

### Data fetching
- React Query hooks in `hooks/use-agents.ts`, `use-knowledge.ts`, etc.
- `unwrap()` helper handles backend response wrapping
- Mutations invalidate relevant query keys on success

### UI components
- shadcn/ui built on `@base-ui/react` (not radix)
- Dialog uses `@base-ui/react/dialog` primitives
- `cn()` utility from `lib/utils.ts` for className merging (clsx + tailwind-merge)

### State
- Zustand store in `store/` for UI state (sidebar collapsed/open)
- React Query for server state

### Path aliases
- `@/*` maps to `./src/*` (configured in tsconfig)

## Key Files

| File | Purpose |
|------|---------|
| `backend/src/agents/agent-executor.service.ts` | Core agent execution — LangChain tool-calling loop |
| `backend/src/ai-providers/providers/*.provider.ts` | AI model providers with `getChatModel()` bridge |
| `backend/src/langchain/runnables/*.ts` | LCEL chains (conversational, RAG, routed) |
| `backend/src/langchain/tools/*.ts` | LangChain tools with Zod schemas |
| `backend/src/langchain/memory/*.ts` | Buffer (Prisma) + Vector (Pinecone) memory |
| `backend/src/langchain/utils/input-sanitizer.ts` | Prompt injection detection |
| `backend/src/knowledge/document-loader.service.ts` | RecursiveCharacterTextSplitter |
| `backend/src/knowledge/embeddings.service.ts` | OpenAIEmbeddings with caching |
| `backend/src/workflows/workflow-engine.service.ts` | LangGraph StateGraph workflows |
| `backend/src/orchestration/orchestration.service.ts` | LangGraph multi-agent orchestration |
| `backend/src/execution/execution.gateway.ts` | WebSocket real-time updates |
| `backend/src/common/filters/prisma-exception.filter.ts` | Prisma error → HTTP status mapping |
| `backend/prisma/schema.prisma` | Database schema (14 models) |
| `frontend/src/components/auth-provider.tsx` | JWT validation + protected route wrapper |
| `frontend/src/lib/api.ts` | Axios instance with auth interceptor |
| `frontend/src/hooks/use-agents.ts` | Agent CRUD + execute hooks |
| `frontend/src/components/agents/execute-agent-dialog.tsx` | Agent chat/execute UI |

## Environment

Backend `.env` is at `backend/.env`. Required:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT signing key
- `OPENAI_API_KEY` — for agent execution

Optional: `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX_HOST`, `SERP_API_KEY`, `CONVERSATION_TTL_DAYS`

Frontend env: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`)

## Security Notes

- Calculator tool uses a safe recursive-descent parser (no `eval()` or `Function()`)
- User input is wrapped in `<user_input>` XML tags before being sent to the LLM
- 12 regex patterns detect common prompt injection attempts
- Tools have a 30s timeout; LLM calls have a 120s timeout
- Agent loop limited to 10 iterations
- Tools disabled after 3 consecutive failures
- Tool credentials come from per-user integration records, not hardcoded

## Common Pitfalls

- **Prisma Json null filtering**: Use `NOT: { field: { equals: Prisma.DbNull } }`, not `field: { not: null }`
- **LangChain streaming + usage_metadata**: `usage_metadata` is undefined during `.stream()` — use `.invoke()` for token tracking
- **Zod v4 + withStructuredOutput**: Breaks — keep Zod at v3
- **@langchain/core version conflicts**: All @langchain packages must share one core version
- **Backend response wrapping**: All API responses are wrapped in `{ data, statusCode, timestamp }` — frontend must unwrap
- **Auth on dashboard routes**: All dashboard pages are behind `AuthProvider` which calls `GET /api/auth/me` on mount

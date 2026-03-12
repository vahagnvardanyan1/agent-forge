export type AIProvider = "ANTHROPIC" | "OPENAI" | "GOOGLE" | "CUSTOM";
export type AgentStatus = "DRAFT" | "ACTIVE" | "PUBLISHED" | "ARCHIVED";

export interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  systemPrompt: string;
  avatarSeed: string;
  status: AgentStatus;
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  flowConfig: Record<string, unknown> | null;
  isPublished: boolean;
  price: number | null;
  category: string | null;
  tags: string[];
  downloads: number;
  rating: number;
  chainType: string | null;
  memoryType: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentInput {
  name: string;
  description: string;
  systemPrompt: string;
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  category?: string;
  tags?: string[];
}

export interface UpdateAgentInput extends Partial<CreateAgentInput> {
  flowConfig?: Record<string, unknown>;
}

export type AIProvider = "ANTHROPIC" | "OPENAI" | "GOOGLE" | "CUSTOM";

export interface AgentTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  longDescription: string | null;
  category: string;
  icon: string | null;
  color: string | null;
  systemPrompt: string;
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  toolNames: string[];
  conversationStarters: string[];
  guardrails: { do?: string[]; dont?: string[] } | null;
  difficulty: string;
  requiredEnvVars: string[];
  memoryType: string | null;
  tags: string[];
  sortOrder: number;
  usageCount: number;
  isPublic: boolean;
  createdAt: string;
}

export interface TemplateCategory {
  name: string;
  count: number;
}

export interface TemplatesResponse {
  templates: AgentTemplate[];
  grouped: Record<string, AgentTemplate[]>;
}

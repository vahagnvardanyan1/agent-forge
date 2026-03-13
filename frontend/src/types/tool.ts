export interface ToolDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  inputSchema: Record<string, unknown>;
  steps: ToolStep[];
  outputMapping: string;
  requiresAuth: boolean;
  authConfig: Record<string, unknown> | null;
  timeoutMs: number;
  isBuiltIn: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StepType = "http" | "llm" | "code" | "knowledge_search" | "transform";

export interface ToolStep {
  name: string;
  type: StepType;
  config: Record<string, unknown>;
}

export interface ToolParam {
  name: string;
  type: "string" | "number" | "boolean";
  description: string;
  required: boolean;
}

export interface CreateToolInput {
  name: string;
  displayName: string;
  description: string;
  category: string;
  inputSchema: Record<string, unknown>;
  steps: ToolStep[];
  outputMapping: string;
  requiresAuth: boolean;
  authConfig?: Record<string, unknown> | null;
  timeoutMs: number;
  isPublic?: boolean;
}

export type UpdateToolInput = Partial<CreateToolInput>;

export interface ToolTestResult {
  success: boolean;
  output: unknown;
  stepResults?: Array<{
    step: string;
    durationMs: number;
    output: unknown;
    error?: string;
  }>;
  error?: string;
  durationMs: number;
}

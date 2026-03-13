export type StepType =
  | 'http'
  | 'llm'
  | 'code'
  | 'knowledge_search'
  | 'transform';

export interface ToolStep {
  name: string;
  type: StepType;
  config: Record<string, unknown>;
}

export interface StepContext {
  input: Record<string, unknown>;
  steps: Record<string, { output: string }>;
  auth: Record<string, string>;
}

export interface StepExecutor {
  execute(
    config: Record<string, unknown>,
    context: StepContext,
  ): Promise<string>;
}

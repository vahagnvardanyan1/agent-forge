export type IntegrationType = "GITHUB" | "JIRA" | "VERCEL" | "TELEGRAM" | "ZAPIER" | "SLACK" | "DISCORD" | "WEBHOOK";

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  expiresAt: string | null;
}

export interface UserIntegration {
  id: string;
  type: IntegrationType;
  expiresAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

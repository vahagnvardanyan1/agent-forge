export interface ZapierConfig {
  apiKey: string;
}

export interface ZapierWebhookPayload {
  zapId: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface ZapierTriggerResult {
  success: boolean;
  zapId: string;
  executionId: string;
  status: string;
}

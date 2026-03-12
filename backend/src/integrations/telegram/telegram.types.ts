export interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
}

export interface TelegramMessage {
  chatId: number;
  text: string;
  messageId: number;
  from: {
    id: number;
    username: string;
    firstName: string;
  };
}

export interface TelegramWebhookUpdate {
  updateId: number;
  message?: TelegramMessage;
}

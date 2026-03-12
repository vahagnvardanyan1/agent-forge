import { Injectable, Logger } from '@nestjs/common';
import type { TelegramConfig, TelegramMessage } from './telegram.types';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  sendMessage(
    _config: TelegramConfig,
    chatId: number,
    text: string,
  ): TelegramMessage {
    this.logger.log(`Sending Telegram message to chat ${chatId}`);
    return {
      chatId,
      text,
      messageId: Date.now(),
      from: { id: 0, username: 'bot', firstName: 'Bot' },
    };
  }

  setWebhook(_config: TelegramConfig, url: string): boolean {
    this.logger.log(`Setting Telegram webhook to ${url}`);
    return true;
  }

  deleteWebhook(_config: TelegramConfig): boolean {
    this.logger.log('Deleting Telegram webhook');
    return true;
  }
}

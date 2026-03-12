import { Injectable, Logger } from '@nestjs/common';
import type {
  DiscordConfig,
  DiscordMessage,
  DiscordGuild,
} from './discord.types';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);

  sendMessage(
    _config: DiscordConfig,
    channelId: string,
    content: string,
  ): DiscordMessage {
    this.logger.log(`Sending Discord message to channel ${channelId}`);
    return {
      id: Date.now().toString(),
      channelId,
      content,
      author: { id: '0', username: 'bot', discriminator: '0000' },
      timestamp: new Date().toISOString(),
    };
  }

  listGuilds(_config: DiscordConfig): DiscordGuild[] {
    this.logger.log('Listing Discord guilds');
    return [];
  }

  getChannelMessages(
    _config: DiscordConfig,
    channelId: string,
    _limit: number = 20,
  ): DiscordMessage[] {
    this.logger.log(`Fetching Discord messages from channel ${channelId}`);
    return [];
  }
}

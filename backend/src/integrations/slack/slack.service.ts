import { Injectable, Logger } from '@nestjs/common';
import type { SlackConfig, SlackMessage, SlackChannel } from './slack.types';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);

  sendMessage(
    _config: SlackConfig,
    channel: string,
    text: string,
    threadTs?: string,
  ): SlackMessage {
    this.logger.log(`Sending Slack message to ${channel}`);
    return {
      channel,
      text,
      ts: Date.now().toString(),
      threadTs,
    };
  }

  listChannels(_config: SlackConfig): SlackChannel[] {
    this.logger.log('Listing Slack channels');
    return [];
  }

  getChannelHistory(
    _config: SlackConfig,
    channel: string,
    _limit: number = 20,
  ): SlackMessage[] {
    this.logger.log(`Fetching Slack channel history for ${channel}`);
    return [];
  }
}

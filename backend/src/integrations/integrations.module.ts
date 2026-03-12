import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { GithubService } from './github/github.service';
import { JiraService } from './jira/jira.service';
import { SlackService } from './slack/slack.service';
import { DiscordService } from './discord/discord.service';
import { TelegramService } from './telegram/telegram.service';
import { VercelService } from './vercel/vercel.service';
import { ZapierService } from './zapier/zapier.service';

@Module({
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    GithubService,
    JiraService,
    SlackService,
    DiscordService,
    TelegramService,
    VercelService,
    ZapierService,
  ],
  exports: [
    IntegrationsService,
    GithubService,
    JiraService,
    SlackService,
    DiscordService,
    TelegramService,
    VercelService,
    ZapierService,
  ],
})
export class IntegrationsModule {}

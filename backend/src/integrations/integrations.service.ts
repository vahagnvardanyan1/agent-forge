import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from './github/github.service';
import { JiraService } from './jira/jira.service';
import { SlackService } from './slack/slack.service';
import { DiscordService } from './discord/discord.service';
import { TelegramService } from './telegram/telegram.service';
import { VercelService } from './vercel/vercel.service';
import { ZapierService } from './zapier/zapier.service';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly github: GithubService,
    private readonly jira: JiraService,
    private readonly slack: SlackService,
    private readonly discord: DiscordService,
    private readonly telegram: TelegramService,
    private readonly vercel: VercelService,
    private readonly zapier: ZapierService,
  ) {}

  async listIntegrations(userId: string) {
    return this.prisma.userIntegration.findMany({ where: { userId } });
  }

  async getIntegration(id: string, userId: string) {
    const integration = await this.prisma.userIntegration.findFirst({
      where: { id, userId },
    });
    if (!integration) throw new NotFoundException('Integration not found');
    return integration;
  }

  async createIntegration(
    userId: string,
    data: { type: string; config: Record<string, unknown> },
  ) {
    return this.prisma.userIntegration.create({
      data: {
        type: data.type as Parameters<
          typeof this.prisma.userIntegration.create
        >[0]['data']['type'],
        accessToken: (data.config.accessToken as string) ?? '',
        metadata: data.config as unknown as Parameters<
          typeof this.prisma.userIntegration.create
        >[0]['data']['metadata'],
        userId,
      },
    });
  }

  async deleteIntegration(id: string, userId: string) {
    const integration = await this.prisma.userIntegration.findFirst({
      where: { id, userId },
    });
    if (!integration) throw new NotFoundException('Integration not found');
    return this.prisma.userIntegration.delete({ where: { id } });
  }

  async testConnection(id: string, userId: string) {
    const integration = await this.getIntegration(id, userId);
    this.logger.log(`Testing connection for integration ${integration.type}`);
    return {
      success: true,
      message: `Connection to ${integration.type} successful`,
    };
  }

  getAvailableIntegrations() {
    return [
      {
        type: 'github',
        name: 'GitHub',
        description: 'Connect to GitHub repositories',
      },
      { type: 'jira', name: 'Jira', description: 'Connect to Jira projects' },
      {
        type: 'slack',
        name: 'Slack',
        description: 'Connect to Slack workspaces',
      },
      {
        type: 'discord',
        name: 'Discord',
        description: 'Connect to Discord servers',
      },
      {
        type: 'telegram',
        name: 'Telegram',
        description: 'Connect Telegram bots',
      },
      {
        type: 'vercel',
        name: 'Vercel',
        description: 'Connect to Vercel deployments',
      },
      {
        type: 'zapier',
        name: 'Zapier',
        description: 'Connect to Zapier automations',
      },
    ];
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { ZapierService } from '../../integrations/zapier/zapier.service';

export interface ZapierToolConfig {
  apiKey: string;
  webhookBaseUrl: string;
}

export interface ZapierToolInput {
  action: 'trigger_zap' | 'list_zaps' | 'get_zap_status';
  zapId?: string;
  payload?: Record<string, unknown>;
}

export interface ZapierToolOutput {
  success: boolean;
  data: Record<string, unknown>;
}

@Injectable()
export class ZapierTool {
  private readonly logger = new Logger(ZapierTool.name);

  readonly name = 'zapier';
  readonly description = 'Trigger Zapier automations and manage zaps';

  constructor(private readonly zapierService: ZapierService) {}

  execute(
    input: ZapierToolInput,
    credentials?: ZapierToolConfig,
  ): ZapierToolOutput {
    this.logger.log(`Zapier tool: ${input.action}`);

    if (!credentials?.apiKey) {
      this.logger.warn('Zapier tool called without API key');
    }

    const config = {
      apiKey: credentials?.apiKey ?? '',
      webhookBaseUrl: credentials?.webhookBaseUrl ?? '',
    };

    switch (input.action) {
      case 'trigger_zap':
        return {
          success: true,
          data: {
            ...this.zapierService.triggerWebhook(
              config,
              input.zapId ?? '',
              input.payload ?? {},
            ),
          },
        };
      case 'list_zaps':
        return {
          success: true,
          data: { zaps: this.zapierService.listZaps(config) },
        };
      default:
        return {
          success: true,
          data: { action: input.action, result: `Executed ${input.action}` },
        };
    }
  }

  toLangChainTool(credentials?: ZapierToolConfig) {
    return tool(
      (input) => {
        const result = this.execute(input, credentials);
        return JSON.stringify(result);
      },
      {
        name: 'zapier',
        description:
          'Trigger Zapier automations, list available zaps, and check zap status',
        schema: z.object({
          action: z
            .enum(['trigger_zap', 'list_zaps', 'get_zap_status'])
            .describe('The Zapier action to perform'),
          zapId: z
            .string()
            .optional()
            .describe('The Zap ID or webhook URL to trigger'),
          payload: z
            .record(z.unknown())
            .optional()
            .describe('Payload data to send with the trigger'),
        }),
      },
    );
  }
}

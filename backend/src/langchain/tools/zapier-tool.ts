import { Injectable, Logger } from '@nestjs/common';

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

  execute(input: ZapierToolInput): ZapierToolOutput {
    this.logger.log(`Zapier tool: ${input.action}`);

    return {
      success: true,
      data: { action: input.action, result: `Executed ${input.action}` },
    };
  }
}

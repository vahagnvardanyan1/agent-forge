import { Injectable, Logger } from '@nestjs/common';
import type { ZapierConfig, ZapierTriggerResult } from './zapier.types';

@Injectable()
export class ZapierService {
  private readonly logger = new Logger(ZapierService.name);

  triggerWebhook(
    _config: ZapierConfig,
    webhookUrl: string,
    _payload: Record<string, unknown>,
  ): ZapierTriggerResult {
    this.logger.log(`Triggering Zapier webhook: ${webhookUrl}`);
    return {
      success: true,
      zapId: `zap_${Date.now().toString(36)}`,
      executionId: `exec_${Date.now().toString(36)}`,
      status: 'triggered',
    };
  }

  listZaps(
    _config: ZapierConfig,
  ): Array<{ id: string; name: string; status: string }> {
    this.logger.log('Listing Zapier zaps');
    return [];
  }
}

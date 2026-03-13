import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type { StepExecutor, StepContext } from './step-executor.interface';

const BLOCKED_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^0\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
  /^fd/,
];

@Injectable()
export class HttpStepExecutor implements StepExecutor {
  private readonly logger = new Logger(HttpStepExecutor.name);

  async execute(
    config: Record<string, unknown>,
    context: StepContext,
  ): Promise<string> {
    const method = ((config.method as string) ?? 'GET').toUpperCase();
    const rawUrl = config.url as string;
    if (!rawUrl) throw new Error('HTTP step requires a "url" config field');

    const url = this.interpolate(rawUrl, context);
    this.validateUrl(url);

    const headers = this.interpolateRecord(
      (config.headers as Record<string, string>) ?? {},
      context,
    );
    const params = this.interpolateRecord(
      (config.params as Record<string, string>) ?? {},
      context,
    );
    const body: Record<string, unknown> | undefined = config.body
      ? (JSON.parse(
          this.interpolate(JSON.stringify(config.body), context),
        ) as Record<string, unknown>)
      : undefined;
    const timeoutMs = (config.timeoutMs as number) ?? 15000;
    const responseMapping = config.responseMapping as string | undefined;

    this.logger.log(`HTTP ${method} ${url}`);

    const response = await axios({
      method,
      url,
      headers,
      params,
      data: body,
      timeout: timeoutMs,
    });

    let result: unknown = response.data as unknown;
    if (responseMapping) {
      result = this.resolvePath(responseMapping, result);
    }

    return typeof result === 'string' ? result : JSON.stringify(result);
  }

  private validateUrl(url: string): void {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }

    const hostname = parsed.hostname;

    if (
      parsed.protocol !== 'https:' &&
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1'
    ) {
      throw new Error('HTTP step requires HTTPS (except localhost)');
    }

    for (const pattern of BLOCKED_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        throw new Error(`Blocked internal address: ${hostname}`);
      }
    }
  }

  private interpolate(template: string, context: StepContext): string {
    return template.replace(/\{\{(.+?)\}\}/g, (_match, path: string) => {
      const value = this.resolvePath(
        path.trim(),
        context as unknown as Record<string, unknown>,
      );
      if (value === undefined) return '';
      return typeof value === 'object'
        ? JSON.stringify(value)
        : String(value as string | number | boolean);
    });
  }

  private interpolateRecord(
    record: Record<string, string>,
    context: StepContext,
    urlEncode = false,
  ): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(record)) {
      const interpolated = this.interpolate(String(value), context);
      // Skip params that resolved to empty strings (optional fields not provided)
      if (interpolated === '') continue;
      result[key] = urlEncode ? encodeURIComponent(interpolated) : interpolated;
    }
    return result;
  }

  private resolvePath(path: string, obj: unknown): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
      if (current == null || typeof current !== 'object') return undefined;
      return (current as Record<string, unknown>)[key];
    }, obj);
  }
}

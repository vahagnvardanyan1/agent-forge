import { Injectable, BadRequestException } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { GoogleProvider } from './providers/google.provider';
import type {
  IAIProvider,
  CompletionParams,
} from './providers/base-provider.interface';

@Injectable()
export class AiProvidersService {
  private providers: Map<string, IAIProvider>;

  constructor(
    private readonly openai: OpenAIProvider,
    private readonly anthropic: AnthropicProvider,
    private readonly google: GoogleProvider,
  ) {
    this.providers = new Map<string, IAIProvider>([
      ['openai', this.openai],
      ['anthropic', this.anthropic],
      ['google', this.google],
    ]);
  }

  getProvider(name: string): IAIProvider {
    const provider = this.providers.get(name);
    if (!provider) throw new BadRequestException(`Unknown provider: ${name}`);
    return provider;
  }

  async complete(providerName: string, params: CompletionParams) {
    return this.getProvider(providerName).complete(params);
  }

  async *streamComplete(providerName: string, params: CompletionParams) {
    yield* this.getProvider(providerName).streamComplete(params);
  }

  listProviders() {
    return Array.from(this.providers.keys()).map((name) => ({
      name,
      models: this.providers.get(name)!.listModels(),
    }));
  }
}

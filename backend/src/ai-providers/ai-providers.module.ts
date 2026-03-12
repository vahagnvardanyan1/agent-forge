import { Module } from '@nestjs/common';
import { AiProvidersService } from './ai-providers.service';
import { OpenAIProvider } from './providers/openai.provider';
import { AnthropicProvider } from './providers/anthropic.provider';
import { GoogleProvider } from './providers/google.provider';

@Module({
  providers: [
    AiProvidersService,
    OpenAIProvider,
    AnthropicProvider,
    GoogleProvider,
  ],
  exports: [AiProvidersService],
})
export class AiProvidersModule {}

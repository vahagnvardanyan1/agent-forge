import { Injectable, Logger } from '@nestjs/common';

export interface ConversationalInput {
  message: string;
  history: Array<{ role: string; content: string }>;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
}

export interface ConversationalOutput {
  response: string;
  tokensUsed: number;
  model: string;
}

@Injectable()
export class ConversationalRunnable {
  private readonly logger = new Logger(ConversationalRunnable.name);

  invoke(input: ConversationalInput): ConversationalOutput {
    this.logger.log(
      `Conversational invoke with ${input.history.length} history messages`,
    );

    return {
      response: `Response to: ${input.message}`,
      tokensUsed: 0,
      model: input.model ?? 'gpt-4o',
    };
  }

  *stream(input: ConversationalInput): Generator<string> {
    this.logger.log(
      `Conversational stream with ${input.history.length} history messages`,
    );
    const words = `Streaming response to: ${input.message}`.split(' ');
    for (const word of words) {
      yield word + ' ';
    }
  }
}

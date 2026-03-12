/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { AiProvidersService } from '../../ai-providers/ai-providers.service';

export interface RouteConfig {
  name: string;
  description: string;
  handler: string;
}

export interface RoutedInput {
  message: string;
  routes: RouteConfig[];
  context?: Record<string, unknown>;
  provider?: string;
  model?: string;
}

export interface RoutedOutput {
  selectedRoute: string;
  handler: string;
  response: string;
  confidence: number;
}

@Injectable()
export class RoutedRunnable {
  private readonly logger = new Logger(RoutedRunnable.name);

  constructor(private readonly aiProviders: AiProvidersService) {}

  async invoke(input: RoutedInput): Promise<RoutedOutput> {
    this.logger.log(`Routing message across ${input.routes.length} routes`);

    if (input.routes.length === 0) {
      return {
        selectedRoute: 'default',
        handler: '',
        response: input.message,
        confidence: 0,
      };
    }

    const providerName = input.provider ?? 'openai';
    const model = this.aiProviders.getProvider(providerName).getChatModel({
      model: input.model,
      temperature: 0,
    });

    const routeNames = input.routes.map((r) => r.name);

    const routeSchema = z.object({
      selectedRoute: z
        .string()
        .describe(
          `The name of the selected route. Must be one of: ${routeNames.join(', ')}`,
        ),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe('Confidence score between 0 and 1'),
      reasoning: z.string().describe('Brief explanation for the selection'),
    });

    const structuredModel = model.withStructuredOutput(routeSchema);

    const routeDescriptions = input.routes
      .map((r) => `- ${r.name}: ${r.description}`)
      .join('\n');

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a routing assistant. Given a user message, select the most appropriate route from the available options.\n\nAvailable routes:\n${routeDescriptions}`,
      ],
      ['human', '{message}'],
    ]);

    const chain = prompt.pipe(structuredModel);

    const result = await chain.invoke({ message: input.message });

    const selectedRoute = routeNames.includes(result.selectedRoute)
      ? result.selectedRoute
      : routeNames[0];

    // Fix #22: Return the handler identifier so callers can dispatch to the right handler
    const matchedRoute = input.routes.find((r) => r.name === selectedRoute);

    return {
      selectedRoute,
      handler: matchedRoute?.handler ?? '',
      response: result.reasoning ?? `Routed to ${selectedRoute}`,
      confidence: result.confidence ?? 0.95,
    };
  }
}

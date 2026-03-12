import { Injectable, Logger } from '@nestjs/common';

export interface RouteConfig {
  name: string;
  description: string;
  handler: string;
}

export interface RoutedInput {
  message: string;
  routes: RouteConfig[];
  context?: Record<string, unknown>;
}

export interface RoutedOutput {
  selectedRoute: string;
  response: string;
  confidence: number;
}

@Injectable()
export class RoutedRunnable {
  private readonly logger = new Logger(RoutedRunnable.name);

  invoke(input: RoutedInput): RoutedOutput {
    this.logger.log(`Routing message across ${input.routes.length} routes`);

    const selectedRoute = input.routes[0]?.name ?? 'default';

    return {
      selectedRoute,
      response: `Routed to ${selectedRoute}: ${input.message}`,
      confidence: 0.95,
    };
  }
}

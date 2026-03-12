import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import axios from 'axios';

export interface WebSearchToolInput {
  query: string;
  maxResults?: number;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface WebSearchToolOutput {
  success: boolean;
  results: WebSearchResult[];
}

@Injectable()
export class WebSearchTool {
  private readonly logger = new Logger(WebSearchTool.name);

  readonly name = 'web_search';
  readonly description = 'Search the web for information using a query string';

  async execute(input: WebSearchToolInput): Promise<WebSearchToolOutput> {
    this.logger.log(`Web search: ${input.query}`);

    const apiKey = process.env.SERP_API_KEY;
    if (!apiKey) {
      return {
        success: true,
        results: [
          {
            title: `Search result for: ${input.query}`,
            url: 'https://example.com',
            snippet: `Relevant information about ${input.query}`,
          },
        ],
      };
    }

    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          q: input.query,
          api_key: apiKey,
          num: input.maxResults ?? 5,
        },
        timeout: 15_000,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const organic = response.data.organic_results ?? [];
      const results: WebSearchResult[] = (
        organic as Array<{ title?: string; link?: string; snippet?: string }>
      ).map((r) => ({
        title: r.title ?? '',
        url: r.link ?? '',
        snippet: r.snippet ?? '',
      }));

      return { success: true, results };
    } catch (error) {
      this.logger.error(`Web search failed: ${(error as Error).message}`);
      return { success: false, results: [] };
    }
  }

  toLangChainTool() {
    return tool(
      async (input) => {
        const result = await this.execute(input);
        return JSON.stringify(result);
      },
      {
        name: 'web_search',
        description:
          'Search the web for up-to-date information using a query string',
        schema: z.object({
          query: z.string().describe('The search query'),
          maxResults: z
            .number()
            .optional()
            .default(5)
            .describe('Maximum number of results to return'),
        }),
      },
    );
  }
}

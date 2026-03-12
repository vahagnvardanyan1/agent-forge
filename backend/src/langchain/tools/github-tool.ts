import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { GithubService } from '../../integrations/github/github.service';

export interface GithubToolConfig {
  accessToken: string;
}

export interface GithubToolInput {
  action: 'create_issue' | 'list_issues' | 'create_pr' | 'get_repo_info';
  repo: string;
  params?: Record<string, unknown>;
}

export interface GithubToolOutput {
  success: boolean;
  data: Record<string, unknown>;
}

@Injectable()
export class GithubTool {
  private readonly logger = new Logger(GithubTool.name);

  readonly name = 'github';
  readonly description =
    'Interact with GitHub repositories: create issues, list issues, create pull requests, get repo info';

  constructor(private readonly githubService: GithubService) {}

  execute(
    input: GithubToolInput,
    credentials?: GithubToolConfig,
  ): GithubToolOutput {
    this.logger.log(`GitHub tool: ${input.action} on ${input.repo}`);

    const accessToken = credentials?.accessToken ?? '';
    if (!accessToken) {
      this.logger.warn('GitHub tool called without access token');
    }

    const [owner, repo] = input.repo.split('/');
    const config = { owner, repo, accessToken };

    switch (input.action) {
      case 'list_issues':
        return {
          success: true,
          data: { issues: this.githubService.listIssues(config) },
        };
      case 'create_issue':
        return {
          success: true,
          data: {
            issue: this.githubService.createIssue(
              config,
              (input.params?.title as string) ?? 'New Issue',
              (input.params?.body as string) ?? '',
            ),
          },
        };
      case 'get_repo_info':
        return {
          success: true,
          data: { repo: this.githubService.getRepository(config) },
        };
      default:
        return {
          success: true,
          data: { action: input.action, repo: input.repo, result: 'executed' },
        };
    }
  }

  toLangChainTool(credentials?: GithubToolConfig) {
    return tool(
      (input) => {
        const result = this.execute(input, credentials);
        return JSON.stringify(result);
      },
      {
        name: 'github',
        description:
          'Interact with GitHub repositories: create issues, list issues, create pull requests, get repo info',
        schema: z.object({
          action: z
            .enum(['create_issue', 'list_issues', 'create_pr', 'get_repo_info'])
            .describe('The GitHub action to perform'),
          repo: z.string().describe('Repository in owner/repo format'),
          params: z
            .record(z.unknown())
            .optional()
            .describe('Additional parameters for the action'),
        }),
      },
    );
  }
}

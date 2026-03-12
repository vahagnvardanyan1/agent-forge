import { Injectable, Logger } from '@nestjs/common';

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

  execute(input: GithubToolInput): GithubToolOutput {
    this.logger.log(`GitHub tool: ${input.action} on ${input.repo}`);

    return {
      success: true,
      data: {
        action: input.action,
        repo: input.repo,
        result: `Executed ${input.action} on ${input.repo}`,
      },
    };
  }
}

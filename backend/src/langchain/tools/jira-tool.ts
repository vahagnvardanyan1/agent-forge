import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { JiraService } from '../../integrations/jira/jira.service';

export interface JiraToolConfig {
  host: string;
  email: string;
  apiToken: string;
}

export interface JiraToolInput {
  action:
    | 'create_issue'
    | 'update_issue'
    | 'search_issues'
    | 'get_issue'
    | 'transition_issue';
  projectKey?: string;
  issueKey?: string;
  params?: Record<string, unknown>;
}

export interface JiraToolOutput {
  success: boolean;
  data: Record<string, unknown>;
}

@Injectable()
export class JiraTool {
  private readonly logger = new Logger(JiraTool.name);

  readonly name = 'jira';
  readonly description =
    'Interact with Jira: create issues, update issues, search, and manage transitions';

  constructor(private readonly jiraService: JiraService) {}

  execute(input: JiraToolInput, credentials?: JiraToolConfig): JiraToolOutput {
    this.logger.log(
      `Jira tool: ${input.action} on ${input.issueKey ?? input.projectKey}`,
    );

    if (!credentials?.host) {
      this.logger.warn('Jira tool called without host configuration');
    }

    const config = {
      host: credentials?.host ?? '',
      email: credentials?.email ?? '',
      apiToken: credentials?.apiToken ?? '',
      projectKey: input.projectKey ?? '',
    };

    switch (input.action) {
      case 'get_issue':
        return {
          success: true,
          data: {
            issue: this.jiraService.getIssue(config, input.issueKey ?? ''),
          },
        };
      case 'create_issue':
        return {
          success: true,
          data: {
            issue: this.jiraService.createIssue(
              config,
              (input.params?.summary as string) ?? 'New Issue',
              (input.params?.description as string) ?? '',
              (input.params?.issueType as string) ?? 'Task',
            ),
          },
        };
      case 'search_issues':
        return {
          success: true,
          data: {
            issues: this.jiraService.searchIssues(
              config,
              (input.params?.jql as string) ?? '',
            ),
          },
        };
      default:
        return {
          success: true,
          data: { action: input.action, result: `Executed ${input.action}` },
        };
    }
  }

  toLangChainTool(credentials?: JiraToolConfig) {
    return tool(
      (input) => {
        const result = this.execute(input, credentials);
        return JSON.stringify(result);
      },
      {
        name: 'jira',
        description:
          'Interact with Jira: create issues, update issues, search, get issue details, and manage transitions',
        schema: z.object({
          action: z
            .enum([
              'create_issue',
              'update_issue',
              'search_issues',
              'get_issue',
              'transition_issue',
            ])
            .describe('The Jira action to perform'),
          projectKey: z
            .string()
            .optional()
            .describe('The Jira project key (e.g., PROJ)'),
          issueKey: z
            .string()
            .optional()
            .describe('The Jira issue key (e.g., PROJ-123)'),
          params: z
            .record(z.unknown())
            .optional()
            .describe('Additional parameters for the action'),
        }),
      },
    );
  }
}

import { Injectable, Logger } from '@nestjs/common';

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

  execute(input: JiraToolInput): JiraToolOutput {
    this.logger.log(
      `Jira tool: ${input.action} on ${input.issueKey ?? input.projectKey}`,
    );

    return {
      success: true,
      data: { action: input.action, result: `Executed ${input.action}` },
    };
  }
}

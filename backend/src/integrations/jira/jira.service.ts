import { Injectable, Logger } from '@nestjs/common';
import type { JiraConfig, JiraIssue } from './jira.types';

@Injectable()
export class JiraService {
  private readonly logger = new Logger(JiraService.name);

  getIssue(_config: JiraConfig, issueKey: string): JiraIssue {
    this.logger.log(`Fetching Jira issue ${issueKey}`);
    return {
      key: issueKey,
      summary: `Issue ${issueKey}`,
      description: '',
      status: 'To Do',
      assignee: '',
      priority: 'Medium',
      issueType: 'Task',
    };
  }

  createIssue(
    config: JiraConfig,
    summary: string,
    description: string,
    issueType: string = 'Task',
  ): JiraIssue {
    this.logger.log(`Creating Jira issue in ${config.projectKey}: ${summary}`);
    return {
      key: `${config.projectKey}-${Date.now()}`,
      summary,
      description,
      status: 'To Do',
      assignee: '',
      priority: 'Medium',
      issueType,
    };
  }

  searchIssues(_config: JiraConfig, jql: string): JiraIssue[] {
    this.logger.log(`Searching Jira issues: ${jql}`);
    return [];
  }
}

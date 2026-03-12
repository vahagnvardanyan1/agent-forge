export interface JiraConfig {
  host: string;
  email: string;
  apiToken: string;
  projectKey: string;
}

export interface JiraIssue {
  key: string;
  summary: string;
  description: string;
  status: string;
  assignee: string;
  priority: string;
  issueType: string;
}

export interface JiraProject {
  key: string;
  name: string;
  description: string;
  lead: string;
}

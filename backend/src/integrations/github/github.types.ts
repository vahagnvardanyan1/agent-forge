export interface GithubConfig {
  accessToken: string;
  owner: string;
  repo: string;
}

export interface GithubIssue {
  id: number;
  title: string;
  body: string;
  state: string;
  url: string;
  createdAt: string;
}

export interface GithubPullRequest {
  id: number;
  title: string;
  body: string;
  state: string;
  url: string;
  headBranch: string;
  baseBranch: string;
}

export interface GithubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  language: string;
}

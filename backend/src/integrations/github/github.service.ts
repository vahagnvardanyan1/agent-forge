import { Injectable, Logger } from '@nestjs/common';
import type {
  GithubConfig,
  GithubIssue,
  GithubRepository,
} from './github.types';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  getRepository(config: GithubConfig): GithubRepository {
    this.logger.log(`Fetching repository ${config.owner}/${config.repo}`);
    return {
      id: 1,
      name: config.repo,
      fullName: `${config.owner}/${config.repo}`,
      description: '',
      url: `https://github.com/${config.owner}/${config.repo}`,
      stars: 0,
      language: 'TypeScript',
    };
  }

  listIssues(config: GithubConfig): GithubIssue[] {
    this.logger.log(`Listing issues for ${config.owner}/${config.repo}`);
    return [];
  }

  createIssue(config: GithubConfig, title: string, body: string): GithubIssue {
    this.logger.log(
      `Creating issue in ${config.owner}/${config.repo}: ${title}`,
    );
    return {
      id: Date.now(),
      title,
      body,
      state: 'open',
      url: `https://github.com/${config.owner}/${config.repo}/issues/1`,
      createdAt: new Date().toISOString(),
    };
  }
}

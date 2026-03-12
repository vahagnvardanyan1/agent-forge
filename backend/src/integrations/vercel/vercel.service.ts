import { Injectable, Logger } from '@nestjs/common';
import type {
  VercelConfig,
  VercelProject,
  VercelDeployment,
} from './vercel.types';

@Injectable()
export class VercelService {
  private readonly logger = new Logger(VercelService.name);

  listProjects(_config: VercelConfig): VercelProject[] {
    this.logger.log('Listing Vercel projects');
    return [];
  }

  getDeployment(_config: VercelConfig, deploymentId: string): VercelDeployment {
    this.logger.log(`Fetching Vercel deployment ${deploymentId}`);
    return {
      id: deploymentId,
      url: `https://${deploymentId}.vercel.app`,
      state: 'READY',
      createdAt: new Date().toISOString(),
      readyAt: new Date().toISOString(),
    };
  }

  triggerDeployment(
    _config: VercelConfig,
    projectId: string,
  ): VercelDeployment {
    this.logger.log(`Triggering Vercel deployment for project ${projectId}`);
    return {
      id: `dpl_${Date.now().toString(36)}`,
      url: `https://${projectId}.vercel.app`,
      state: 'BUILDING',
      createdAt: new Date().toISOString(),
    };
  }
}

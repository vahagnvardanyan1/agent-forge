export interface VercelConfig {
  accessToken: string;
  teamId?: string;
}

export interface VercelDeployment {
  id: string;
  url: string;
  state: string;
  createdAt: string;
  readyAt?: string;
}

export interface VercelProject {
  id: string;
  name: string;
  framework: string;
  latestDeployment?: VercelDeployment;
}

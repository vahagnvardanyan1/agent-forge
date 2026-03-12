import type { Node, Edge } from "@xyflow/react";

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  flowConfig: {
    nodes: Node[];
    edges: Edge[];
  };
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Workforce {
  id: string;
  name: string;
  description: string | null;
  handoffStrategy: "sequential" | "parallel" | "conditional" | "manager";
  managerAgentId: string | null;
  config: Record<string, unknown> | null;
  members: WorkforceMember[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkforceMember {
  id: string;
  role: string;
  priority: number;
  agentId: string;
  workforceId: string;
}

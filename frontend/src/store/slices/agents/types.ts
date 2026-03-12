import type { Agent } from "@/types/agent";

export interface IAgentsStore {
  agents: Agent[];
  selectedAgentId: string | null;
  isCreating: boolean;
}

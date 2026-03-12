import type { Node, Edge } from "@xyflow/react";

export interface IBuilderStore {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  isPanelOpen: boolean;
}

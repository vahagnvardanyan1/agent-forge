import type { StateCreator } from "zustand";
import type { IBuilderStore } from "./types";

const createBuilderSlice: StateCreator<IBuilderStore> = () => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isPanelOpen: false,
});

export default createBuilderSlice;

import type { StateCreator } from "zustand";
import type { IAgentsStore } from "./types";

const createAgentsSlice: StateCreator<IAgentsStore> = () => ({
  agents: [],
  selectedAgentId: null,
  isCreating: false,
});

export default createAgentsSlice;

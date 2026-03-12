import type { StateCreator } from "zustand";
import type { IMarketplaceStore } from "./types";

const createMarketplaceSlice: StateCreator<IMarketplaceStore> = () => ({
  marketplaceAgents: [],
  selectedCategory: null,
  searchQuery: "",
});

export default createMarketplaceSlice;

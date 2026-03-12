import type { MarketplaceAgent } from "@/types/marketplace";

export interface IMarketplaceStore {
  marketplaceAgents: MarketplaceAgent[];
  selectedCategory: string | null;
  searchQuery: string;
}

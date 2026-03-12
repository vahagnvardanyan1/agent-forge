import type { Agent } from "./agent";

export interface MarketplaceAgent extends Agent {
  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  reviews: MarketplaceReview[];
}

export interface MarketplaceReview {
  id: string;
  rating: number;
  comment: string | null;
  user: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export interface MarketplaceFilters {
  category?: string;
  search?: string;
  priceType?: "free" | "paid";
  minRating?: number;
  provider?: string;
}

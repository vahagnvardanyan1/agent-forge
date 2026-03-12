"use client";

import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { useMarketplace } from "@/hooks/use-marketplace";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const { data, isLoading, isError } = useMarketplace(
    { search: search || undefined, category: category === "All" ? undefined : category },
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">Discover and install community-built AI agents.</p>
      </div>
      <MarketplaceFilters onSearchChange={setSearch} onCategoryChange={setCategory} />
      {isLoading && !isError ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : data?.agents?.length ? (
        <MarketplaceGrid agents={data.agents} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg font-medium">No agents found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

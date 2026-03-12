import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MarketplaceAgent, MarketplaceFilters } from "@/types/marketplace";

function unwrap<T>(body: T & { data?: T }): T {
  return body.data ?? body;
}

export const useMarketplace = (filters?: MarketplaceFilters, page: number = 1) =>
  useQuery({
    queryKey: ["marketplace", filters, page],
    queryFn: async () => {
      const { data } = await api.get("/marketplace", {
        params: { ...filters, page },
      });
      return unwrap(data) as { agents: MarketplaceAgent[]; total: number };
    },
  });

export const useMarketplaceAgent = (id: string) =>
  useQuery({
    queryKey: ["marketplace", id],
    queryFn: async () => {
      const { data } = await api.get(`/marketplace/${id}`);
      return unwrap(data) as MarketplaceAgent;
    },
    enabled: !!id,
  });

export const usePublishAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { agentId: string; price?: number; category?: string; tags?: string[] }) => {
      const { data } = await api.post("/marketplace/publish", input);
      return unwrap(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["marketplace"] }),
  });
};

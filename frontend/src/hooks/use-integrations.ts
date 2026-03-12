import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { UserIntegration } from "@/types/integration";

export const useIntegrations = () =>
  useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const { data } = await api.get<{ data: UserIntegration[] }>("/integrations");
      return data.data;
    },
  });

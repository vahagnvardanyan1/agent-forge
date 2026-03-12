import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Agent, CreateAgentInput, UpdateAgentInput } from "@/types/agent";

/** Unwrap backend response: handles both raw `{...}` and wrapped `{data: {...}}` shapes */
function unwrap<T>(body: T & { data?: T }): T {
  return body.data ?? body;
}

export const useAgents = (page: number = 1) =>
  useQuery({
    queryKey: ["agents", page],
    queryFn: async () => {
      const { data } = await api.get("/agents", { params: { page } });
      return unwrap(data) as { agents: Agent[]; total: number };
    },
  });

export const useAgent = (id: string) =>
  useQuery({
    queryKey: ["agent", id],
    queryFn: async () => {
      const { data } = await api.get(`/agents/${id}`);
      return unwrap(data) as Agent;
    },
    enabled: !!id,
  });

export const useCreateAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAgentInput) => {
      const { data } = await api.post("/agents", input);
      return unwrap(data) as Agent;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agents"] }),
  });
};

export const useUpdateAgent = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateAgentInput) => {
      const { data } = await api.patch(`/agents/${id}`, input);
      return unwrap(data) as Agent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["agent", id] });
    },
  });
};

export const useDeleteAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/agents/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agents"] }),
  });
};

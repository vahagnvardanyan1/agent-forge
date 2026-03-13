import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  ToolDefinition,
  CreateToolInput,
  UpdateToolInput,
  ToolTestResult,
} from "@/types/tool";

/** Unwrap backend response: handles both raw `{...}` and wrapped `{data: {...}}` shapes */
function unwrap<T>(body: T & { data?: T }): T {
  return body.data ?? body;
}

export const useTools = (page: number = 1) =>
  useQuery({
    queryKey: ["tools", page],
    queryFn: async () => {
      const { data } = await api.get("/tools", { params: { page } });
      return unwrap(data) as { tools: ToolDefinition[]; total: number };
    },
  });

export const useToolById = (id: string) =>
  useQuery({
    queryKey: ["tool", id],
    queryFn: async () => {
      const { data } = await api.get(`/tools/${id}`);
      return unwrap(data) as ToolDefinition;
    },
    enabled: !!id,
  });

export const useCreateTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateToolInput) => {
      const { data } = await api.post("/tools", input);
      return unwrap(data) as ToolDefinition;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tools"] }),
  });
};

export const useUpdateTool = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateToolInput) => {
      const { data } = await api.patch(`/tools/${id}`, input);
      return unwrap(data) as ToolDefinition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", id] });
    },
  });
};

export const useDeleteTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tools/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tools"] }),
  });
};

export const useTestTool = () =>
  useMutation({
    mutationFn: async ({
      name,
      input,
    }: {
      name: string;
      input: Record<string, unknown>;
    }) => {
      const { data } = await api.post(`/tools/${name}/test`, { input });
      return unwrap(data) as ToolTestResult;
    },
  });

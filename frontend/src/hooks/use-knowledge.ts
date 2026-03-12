import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { KnowledgeBase } from "@/types/knowledge";

function unwrap<T>(body: T & { data?: T }): T {
  return body.data ?? body;
}

export const useKnowledgeBases = () =>
  useQuery({
    queryKey: ["knowledge-bases"],
    queryFn: async () => {
      const { data } = await api.get("/knowledge");
      return unwrap(data) as KnowledgeBase[];
    },
  });

export const useKnowledgeBase = (id: string) =>
  useQuery({
    queryKey: ["knowledge-base", id],
    queryFn: async () => {
      const { data } = await api.get(`/knowledge/${id}`);
      return unwrap(data) as KnowledgeBase;
    },
    enabled: !!id,
  });

export const useCreateKnowledgeBase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const { data } = await api.post("/knowledge", input);
      return unwrap(data) as KnowledgeBase;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["knowledge-bases"] }),
  });
};

export const useUploadDocument = (knowledgeBaseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post(`/knowledge/${knowledgeBaseId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return unwrap(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["knowledge-base", knowledgeBaseId] }),
  });
};

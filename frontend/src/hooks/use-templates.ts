import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  TemplatesResponse,
  TemplateCategory,
  AgentTemplate,
} from "@/types/template";

function unwrap<T>(body: T & { data?: T }): T {
  return body.data ?? body;
}

export const useTemplates = (category?: string) =>
  useQuery({
    queryKey: ["templates", category ?? "all"],
    queryFn: async () => {
      const params = category ? { category } : {};
      const { data } = await api.get("/templates", { params });
      return unwrap(data) as TemplatesResponse;
    },
  });

export const useTemplateCategories = () =>
  useQuery({
    queryKey: ["template-categories"],
    queryFn: async () => {
      const { data } = await api.get("/templates/categories");
      return unwrap(data) as TemplateCategory[];
    },
  });

export const useTemplate = (name: string) =>
  useQuery({
    queryKey: ["template", name],
    queryFn: async () => {
      const { data } = await api.get(`/templates/${name}`);
      return unwrap(data) as AgentTemplate;
    },
    enabled: !!name,
  });

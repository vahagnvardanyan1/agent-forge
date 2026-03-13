"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AgentForm } from "@/components/agents/agent-form";
import { TemplateGallery } from "@/components/agents/template-gallery";
import { useCreateAgent } from "@/hooks/use-agents";
import type { CreateAgentInput } from "@/types/agent";

export default function NewAgentPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateAgent();

  const handleSubmit = (data: CreateAgentInput) => {
    mutate(data, {
      onSuccess: (agent) => {
        if (agent?.id) {
          toast.success("Agent created successfully");
          router.push(`/dashboard/agents/${agent.id}`);
        } else {
          toast.error(
            "Could not create agent — database is unavailable. Start Postgres with: npm run setup",
          );
        }
      },
      onError: () => {
        toast.error(
          "Failed to create agent. Check that the backend is running.",
        );
      },
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Agent</h1>
        <p className="text-muted-foreground">
          Choose a template to get started instantly, or build from scratch.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Templates</h2>
        <TemplateGallery />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or create from scratch
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <AgentForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}

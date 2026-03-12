"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AgentForm } from "@/components/agents/agent-form";
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
          toast.error("Could not create agent — database is unavailable. Start Postgres with: npm run setup");
        }
      },
      onError: () => {
        toast.error("Failed to create agent. Check that the backend is running.");
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Agent</h1>
        <p className="text-muted-foreground">Configure your AI agent&apos;s behavior and capabilities.</p>
      </div>
      <AgentForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}

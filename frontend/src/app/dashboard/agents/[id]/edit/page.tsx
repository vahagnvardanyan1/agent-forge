"use client";

import { use } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { AgentForm } from "@/components/agents/agent-form";
import { useAgent, useUpdateAgent } from "@/hooks/use-agents";
import type { CreateAgentInput } from "@/types/agent";

export default function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: agent, isLoading, isError } = useAgent(id);
  const { mutate, isPending } = useUpdateAgent(id);

  if (isLoading && !isError) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (!agent) return <p>Agent not found.</p>;

  const handleSubmit = (data: CreateAgentInput) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Agent updated");
        router.push(`/dashboard/agents/${id}`);
      },
      onError: () => {
        toast.error("Failed to update agent. Database may be unavailable.");
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Agent</h1>
        <p className="text-muted-foreground">Update your agent&apos;s configuration.</p>
      </div>
      <AgentForm defaultValues={{ ...agent, category: agent.category ?? undefined, tags: agent.tags ?? undefined }} onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}

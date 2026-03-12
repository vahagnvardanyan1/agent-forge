"use client";

import { use } from "react";

import { useAgent } from "@/hooks/use-agents";
import { Skeleton } from "@/components/ui/skeleton";
import { BuilderCanvas } from "@/components/agents/agent-builder/builder-canvas";

export default function AgentBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: agent, isLoading, isError } = useAgent(id);

  if (isLoading && !isError) return <Skeleton className="h-[calc(100vh-10rem)] rounded-xl" />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{agent?.name ?? "Agent"} Builder</h1>
        <p className="text-sm text-muted-foreground">Drag and drop nodes to build your agent workflow.</p>
      </div>
      <div className="h-[calc(100vh-14rem)] rounded-xl border border-border overflow-hidden">
        <BuilderCanvas agentName={agent?.name} />
      </div>
    </div>
  );
}

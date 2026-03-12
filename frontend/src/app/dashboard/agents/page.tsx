"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentCard } from "@/components/agents/agent-card";
import { useAgents } from "@/hooks/use-agents";

export default function AgentsPage() {
  const { data, isLoading, isError } = useAgents();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Agents</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Create and manage your AI agents.</p>
        </div>
        <Button className="w-fit gap-2" asChild>
          <Link href="/dashboard/agents/new">
            <Plus className="h-4 w-4" />
            New Agent
          </Link>
        </Button>
      </div>

      {isLoading && !isError ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : data?.agents?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-lg font-medium">No agents yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first AI agent to get started.</p>
          <Button className="mt-4 gap-2" asChild>
            <Link href="/dashboard/agents/new">
              <Plus className="h-4 w-4" />
              Create Agent
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

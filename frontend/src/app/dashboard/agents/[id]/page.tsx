"use client";

import { use, useState, useEffect } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Settings, Play, Code, BarChart3, Trash2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AgentAvatar } from "@/components/agents/agent-avatar";
import { ExecuteAgentDialog } from "@/components/agents/execute-agent-dialog";
import { useAgent, useDeleteAgent } from "@/hooks/use-agents";

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: agent, isLoading, isError } = useAgent(id);
  const [executeOpen, setExecuteOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteAgent, isPending: isDeleting } = useDeleteAgent();

  // Auto-open chat when redirected from template creation
  useEffect(() => {
    if (searchParams.get("chat") === "true" && agent?.name) {
      setExecuteOpen(true);
    }
  }, [searchParams, agent?.name]);

  if (isLoading && !isError) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!agent || !agent.name) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-lg font-medium">Agent not found</p>
        <p className="mt-1 text-sm text-muted-foreground">This agent doesn&apos;t exist or the database is unavailable.</p>
        <Button className="mt-4" variant="outline" asChild>
          <Link href="/dashboard/agents"><ArrowLeft className="mr-2 h-4 w-4" />Back to Agents</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/agents"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <AgentAvatar seed={agent.avatarSeed} size={64} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{agent.status?.toLowerCase() ?? "draft"}</Badge>
            <span className="text-sm text-muted-foreground">{agent.provider} / {agent.model}</span>
            {agent.templateName && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {agent.templateName.replace(/-/g, " ")}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <Link href={`/dashboard/agents/${id}/builder`}>
            <Settings className="h-3.5 w-3.5" />
            Builder
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <Link href={`/dashboard/agents/${id}/edit`}>
            <Code className="h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <Link href={`/dashboard/agents/${id}/logs`}>
            <BarChart3 className="h-3.5 w-3.5" />
            Logs
          </Link>
        </Button>
        <Button size="sm" className="gap-1" onClick={() => setExecuteOpen(true)}>
          <Play className="h-3.5 w-3.5" />
          Execute
        </Button>
        <Button variant="destructive" size="sm" className="gap-1 ml-auto" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Configuration</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Temperature</dt>
              <dd className="font-mono">{agent.temperature}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Max Tokens</dt>
              <dd className="font-mono">{agent.maxTokens}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Downloads</dt>
              <dd>{agent.downloads}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Rating</dt>
              <dd>{agent.rating?.toFixed(1) ?? "0.0"}</dd>
            </div>
          </dl>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-2">System Prompt</h3>
          <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm font-mono">{agent.systemPrompt}</pre>
        </Card>
      </div>

      <ExecuteAgentDialog
        agentId={id}
        agentName={agent.name}
        open={executeOpen}
        onOpenChange={setExecuteOpen}
        conversationStarters={agent.conversationStarters}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{agent.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteAgent(id, {
                  onSuccess: () => router.push("/dashboard/agents"),
                });
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

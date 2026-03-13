"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Play, Settings, Pencil, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AgentAvatar } from "@/components/agents/agent-avatar";
import { useDeleteAgent } from "@/hooks/use-agents";
import type { Agent } from "@/types/agent";

interface AgentCardProps {
  agent: Agent;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  ACTIVE: "bg-green-500/10 text-green-600",
  PUBLISHED: "bg-blue-500/10 text-blue-600",
  ARCHIVED: "bg-yellow-500/10 text-yellow-600",
};

export const AgentCard = ({ agent }: AgentCardProps) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteAgent, isPending } = useDeleteAgent();

  const handleDelete = () => {
    deleteAgent(agent.id, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

  return (
    <>
      <Card className="group relative flex flex-col p-6 transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <AgentAvatar seed={agent.avatarSeed} size={48} />
            <div>
              <Link href={`/dashboard/agents/${agent.id}`} className="font-semibold hover:underline">
                {agent.name}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={STATUS_COLORS[agent.status] ?? ""}>
                  {agent.status.toLowerCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">{agent.model}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/agents/${agent.id}/edit`)}>
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{agent.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Button size="sm" variant="outline" className="gap-1" asChild>
            <Link href={`/dashboard/agents/${agent.id}/builder`}>
              <Settings className="h-3 w-3" />
              Builder
            </Link>
          </Button>
          <Button size="sm" className="gap-1">
            <Play className="h-3 w-3" />
            Run
          </Button>
        </div>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{agent.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

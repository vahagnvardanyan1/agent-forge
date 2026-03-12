import Link from "next/link";
import { MoreHorizontal, Play, Settings } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgentAvatar } from "@/components/agents/agent-avatar";
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

export const AgentCard = ({ agent }: AgentCardProps) => (
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
      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
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
);

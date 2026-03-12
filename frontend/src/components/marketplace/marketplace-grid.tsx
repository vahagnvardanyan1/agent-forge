import Link from "next/link";
import { Star, Download } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentAvatar } from "@/components/agents/agent-avatar";
import type { MarketplaceAgent } from "@/types/marketplace";

interface MarketplaceGridProps {
  agents: MarketplaceAgent[];
}

export const MarketplaceGrid = ({ agents }: MarketplaceGridProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {agents.map((agent) => (
      <Link key={agent.id} href={`/dashboard/marketplace/${agent.id}`}>
        <Card className="p-6 transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <AgentAvatar seed={agent.avatarSeed} size={48} />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{agent.name}</h3>
              <p className="text-xs text-muted-foreground">by {agent.author.name ?? "Unknown"}</p>
            </div>
            {agent.price && agent.price > 0 ? (
              <Badge variant="secondary">${agent.price}</Badge>
            ) : (
              <Badge variant="outline">Free</Badge>
            )}
          </div>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{agent.description}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {agent.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {agent.downloads}
            </span>
          </div>
          {agent.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {agent.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </Card>
      </Link>
    ))}
  </div>
);

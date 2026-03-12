"use client";

import { use } from "react";

import Link from "next/link";
import { ArrowLeft, Star, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentAvatar } from "@/components/agents/agent-avatar";
import { useMarketplaceAgent } from "@/hooks/use-marketplace";

export default function MarketplaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: agent, isLoading, isError } = useMarketplaceAgent(id);

  if (isLoading && !isError) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (!agent) return <p>Agent not found.</p>;

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" className="gap-1" asChild>
        <Link href="/dashboard/marketplace"><ArrowLeft className="h-3.5 w-3.5" />Back</Link>
      </Button>

      <div className="flex items-start gap-6">
        <AgentAvatar seed={agent.avatarSeed} size={96} />
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
          <p className="mt-1 text-muted-foreground">by {agent.author.name ?? "Unknown"}</p>
          <div className="mt-3 flex items-center gap-4">
            <span className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              {agent.rating.toFixed(1)} ({agent.reviews.length} reviews)
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              {agent.downloads} downloads
            </span>
            {agent.price && agent.price > 0 ? (
              <Badge>${agent.price}/mo</Badge>
            ) : (
              <Badge variant="outline">Free</Badge>
            )}
          </div>
        </div>
        <Button size="lg">Install Agent</Button>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>
      </Card>

      {agent.reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reviews</h3>
          {agent.reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div>
                  <p className="text-sm font-medium">{review.user.name ?? "Anonymous"}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
              </div>
              {review.comment && <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

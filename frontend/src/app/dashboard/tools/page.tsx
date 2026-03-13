"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTools } from "@/hooks/use-tools";

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-muted text-muted-foreground",
  search: "bg-blue-500/10 text-blue-600",
  utility: "bg-purple-500/10 text-purple-600",
  integration: "bg-green-500/10 text-green-600",
};

export default function ToolsPage() {
  const { data, isLoading, isError } = useTools();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tools</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Build and manage custom tools for your agents.
          </p>
        </div>
        <Button className="w-fit gap-2" asChild>
          <Link href="/dashboard/tools/new">
            <Plus className="h-4 w-4" />
            Create Tool
          </Link>
        </Button>
      </div>

      {isLoading && !isError ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : data?.tools?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.tools.map((tool) => (
            <Card
              key={tool.id}
              className="group relative flex cursor-pointer flex-col p-6 transition-all hover:shadow-md"
              onClick={() => router.push(`/dashboard/tools/${tool.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tool.displayName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={CATEGORY_COLORS[tool.category] ?? ""}
                      >
                        {tool.category}
                      </Badge>
                      {tool.isBuiltIn && (
                        <Badge variant="outline">Built-in</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {tool.description}
              </p>
              <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
                <span>{tool.steps.length} step{tool.steps.length !== 1 ? "s" : ""}</span>
                {tool.requiresAuth && (
                  <>
                    <span>&middot;</span>
                    <span>Auth required</span>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <p className="text-lg font-medium">No tools yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first custom tool to extend your agents.
          </p>
          <Button className="mt-4 gap-2" asChild>
            <Link href="/dashboard/tools/new">
              <Plus className="h-4 w-4" />
              Create Tool
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

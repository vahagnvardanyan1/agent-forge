"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ToolTestPanel } from "@/components/tools/tool-test-panel";
import { useToolById, useDeleteTool } from "@/hooks/use-tools";
import { cn } from "@/lib/utils";

const STEP_TYPE_COLORS: Record<string, string> = {
  http: "bg-blue-500/10 text-blue-600",
  transform: "bg-purple-500/10 text-purple-600",
  llm: "bg-green-500/10 text-green-600",
  code: "bg-orange-500/10 text-orange-600",
  knowledge_search: "bg-teal-500/10 text-teal-600",
};

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: tool, isLoading } = useToolById(id);
  const { mutate: deleteTool, isPending: isDeleting } = useDeleteTool();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this tool?")) return;
    deleteTool(id, {
      onSuccess: () => {
        toast.success("Tool deleted");
        router.push("/dashboard/tools");
      },
      onError: () => toast.error("Failed to delete tool"),
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-muted-foreground">Tool not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/dashboard/tools">Back to Tools</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/dashboard/tools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{tool.displayName}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{tool.category}</Badge>
        {tool.isBuiltIn && <Badge variant="outline">Built-in</Badge>}
        {tool.isPublic && <Badge variant="outline">Public</Badge>}
        {tool.requiresAuth && <Badge variant="outline">Auth Required</Badge>}
      </div>

      <p className="text-muted-foreground">{tool.description}</p>

      <div className="flex gap-2">
        {!tool.isBuiltIn && (
          <>
            <Button variant="outline" size="sm" className="gap-1" asChild>
              <Link href={`/dashboard/tools/${tool.id}/edit`}>
                <Pencil className="h-3 w-3" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
              Delete
            </Button>
          </>
        )}
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Input Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs">
            {JSON.stringify(tool.inputSchema, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Steps Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tool.steps.map((step, index) => (
              <div key={index} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {index + 1}.
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs", STEP_TYPE_COLORS[step.type])}
                  >
                    {step.type}
                  </Badge>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
                <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                  {JSON.stringify(step.config, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {tool.outputMapping && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Output Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm">{tool.outputMapping}</code>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Name (slug)</dt>
              <dd className="font-mono">{tool.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Timeout</dt>
              <dd>{tool.timeoutMs}ms</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd>{new Date(tool.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Updated</dt>
              <dd>{new Date(tool.updatedAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <ToolTestPanel toolName={tool.name} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParamBuilder } from "@/components/tools/param-builder";
import { StepBuilder } from "@/components/tools/step-builder";
import { ToolTestPanel } from "@/components/tools/tool-test-panel";
import { useToolById, useUpdateTool } from "@/hooks/use-tools";
import type { ToolDefinition, ToolParam, ToolStep } from "@/types/tool";

const CATEGORIES = ["general", "search", "utility", "integration"] as const;

function schemaToParams(schema: Record<string, unknown>): ToolParam[] {
  const properties = (schema.properties ?? {}) as Record<string, Record<string, unknown>>;
  const required = (schema.required ?? []) as string[];
  return Object.entries(properties).map(([name, def]) => ({
    name,
    type: (def.type as "string" | "number" | "boolean") || "string",
    description: (def.description as string) || "",
    required: required.includes(name),
  }));
}

function paramsToSchema(params: ToolParam[]): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const p of params) {
    properties[p.name] = {
      type: p.type,
      description: p.description,
    };
    if (p.required) required.push(p.name);
  }
  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

function EditToolForm({ tool, id }: { tool: ToolDefinition; id: string }) {
  const router = useRouter();
  const { mutate: updateTool, isPending } = useUpdateTool(id);

  const [name, setName] = useState(tool.name);
  const [displayName, setDisplayName] = useState(tool.displayName);
  const [description, setDescription] = useState(tool.description);
  const [category, setCategory] = useState(tool.category);
  const [params, setParams] = useState<ToolParam[]>(() => schemaToParams(tool.inputSchema));
  const [steps, setSteps] = useState<ToolStep[]>(tool.steps);
  const [outputMapping, setOutputMapping] = useState(tool.outputMapping);
  const [requiresAuth, setRequiresAuth] = useState(tool.requiresAuth);
  const [timeoutMs, setTimeoutMs] = useState(tool.timeoutMs);
  const [isPublic, setIsPublic] = useState(tool.isPublic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !displayName.trim()) {
      toast.error("Name and display name are required");
      return;
    }

    if (steps.length === 0) {
      toast.error("At least one step is required");
      return;
    }

    updateTool(
      {
        name: name.trim(),
        displayName: displayName.trim(),
        description: description.trim(),
        category,
        inputSchema: paramsToSchema(params),
        steps,
        outputMapping,
        requiresAuth,
        timeoutMs,
        isPublic,
      },
      {
        onSuccess: () => {
          toast.success("Tool updated successfully");
          router.push(`/dashboard/tools/${id}`);
        },
        onError: () => toast.error("Failed to update tool"),
      },
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href={`/dashboard/tools/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Edit Tool
          </h1>
          <p className="text-sm text-muted-foreground">
            Update {tool.displayName} configuration.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Define the tool&apos;s identity and purpose.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name (slug)</Label>
                <Input
                  id="name"
                  placeholder="my_tool"
                  value={name}
                  onChange={(e) => setName(e.target.value.replace(/[^a-z0-9_]/g, ""))}
                />
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and underscores only.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="My Tool"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this tool does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="w-[200px] space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(val) => val && setCategory(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>
              Define the parameters this tool accepts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ParamBuilder params={params} onChange={setParams} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Steps Pipeline</CardTitle>
            <CardDescription>
              Define the sequence of steps this tool executes. Steps run in order
              and can reference previous step outputs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepBuilder steps={steps} onChange={setSteps} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output &amp; Settings</CardTitle>
            <CardDescription>
              Configure output mapping, authentication, and timeouts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="outputMapping">Output Mapping</Label>
              <Input
                id="outputMapping"
                placeholder="steps.transform.result"
                value={outputMapping}
                onChange={(e) => setOutputMapping(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                JSONPath to extract from the final step output.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeoutMs">Timeout (ms)</Label>
                <Input
                  id="timeoutMs"
                  type="number"
                  min={1000}
                  max={120000}
                  value={timeoutMs}
                  onChange={(e) => setTimeoutMs(parseInt(e.target.value) || 30000)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={requiresAuth} onCheckedChange={setRequiresAuth} />
              <Label>Requires Authentication</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              <Label>Public (visible in marketplace)</Label>
            </div>
          </CardContent>
        </Card>

        {name && steps.length > 0 && (
          <ToolTestPanel toolName={name} />
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/tools/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function EditToolPage() {
  const routeParams = useParams();
  const id = routeParams.id as string;
  const { data: tool, isLoading } = useToolById(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
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

  return <EditToolForm tool={tool} id={id} />;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { useCreateTool } from "@/hooks/use-tools";
import type { ToolParam, ToolStep } from "@/types/tool";

const CATEGORIES = ["general", "search", "utility", "integration"] as const;

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

export default function NewToolPage() {
  const router = useRouter();
  const { mutate: createTool, isPending } = useCreateTool();

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [params, setParams] = useState<ToolParam[]>([]);
  const [steps, setSteps] = useState<ToolStep[]>([]);
  const [outputMapping, setOutputMapping] = useState("");
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [timeoutMs, setTimeoutMs] = useState(30000);
  const [isPublic, setIsPublic] = useState(false);

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

    createTool(
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
        onSuccess: (tool) => {
          if (tool?.id) {
            toast.success("Tool created successfully");
            router.push(`/dashboard/tools/${tool.id}`);
          } else {
            toast.error("Could not create tool");
          }
        },
        onError: () => toast.error("Failed to create tool"),
      },
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/dashboard/tools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create New Tool
          </h1>
          <p className="text-sm text-muted-foreground">
            Build a custom tool your agents can use.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
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

        {/* Section 2: Input Parameters */}
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

        {/* Section 3: Steps Pipeline */}
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

        {/* Section 4: Output & Settings */}
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

        {/* Section 5: Test Panel */}
        {name && steps.length > 0 && (
          <ToolTestPanel toolName={name} />
        )}

        {/* Submit */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/tools">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Create Tool
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { Plus, X, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ToolStep, StepType } from "@/types/tool";

interface StepBuilderProps {
  steps: ToolStep[];
  onChange: (steps: ToolStep[]) => void;
}

const STEP_TYPES: { value: StepType; label: string }[] = [
  { value: "http", label: "HTTP Request" },
  { value: "transform", label: "Transform" },
  { value: "llm", label: "LLM Call" },
  { value: "code", label: "Code" },
  { value: "knowledge_search", label: "Knowledge Search" },
];

const STEP_TYPE_COLORS: Record<StepType, string> = {
  http: "bg-blue-500/10 text-blue-600",
  transform: "bg-purple-500/10 text-purple-600",
  llm: "bg-green-500/10 text-green-600",
  code: "bg-orange-500/10 text-orange-600",
  knowledge_search: "bg-teal-500/10 text-teal-600",
};

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

function defaultConfig(type: StepType): Record<string, unknown> {
  switch (type) {
    case "http":
      return { method: "GET", url: "", headers: {}, body: "", responseMapping: "" };
    case "transform":
      return { template: "" };
    case "llm":
      return { provider: "OPENAI", model: "gpt-4o-mini", temperature: 0.7, systemPrompt: "", userPrompt: "" };
    case "code":
      return { handler: "" };
    case "knowledge_search":
      return { knowledgeBaseId: "", query: "", topK: 5 };
  }
}

function KeyValueEditor({
  value,
  onChange,
  label,
}: {
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
  label: string;
}) {
  const entries = Object.entries(value);

  const addEntry = () => onChange({ ...value, "": "" });

  const updateKey = (oldKey: string, newKey: string, index: number) => {
    const newObj: Record<string, string> = {};
    Object.entries(value).forEach(([k, v], i) => {
      newObj[i === index ? newKey : k] = v;
    });
    onChange(newObj);
  };

  const updateValue = (key: string, newVal: string, index: number) => {
    const newObj: Record<string, string> = {};
    Object.entries(value).forEach(([k, v], i) => {
      newObj[k] = i === index ? newVal : v;
    });
    onChange(newObj);
  };

  const removeEntry = (index: number) => {
    const newObj: Record<string, string> = {};
    Object.entries(value).forEach(([k, v], i) => {
      if (i !== index) newObj[k] = v;
    });
    onChange(newObj);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      {entries.map(([k, v], i) => (
        <div key={i} className="flex gap-2">
          <Input
            placeholder="Key"
            value={k}
            onChange={(e) => updateKey(k, e.target.value, i)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={v}
            onChange={(e) => updateValue(k, e.target.value, i)}
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeEntry(i)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={addEntry} className="gap-1 text-xs">
        <Plus className="h-3 w-3" />
        Add {label.toLowerCase()}
      </Button>
    </div>
  );
}

function HttpStepConfig({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="w-[120px] space-y-1">
          <Label className="text-xs">Method</Label>
          <Select
            value={(config.method as string) || "GET"}
            onValueChange={(val) => onChange({ ...config, method: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs">URL</Label>
          <Input
            placeholder="https://api.example.com/{{query}}"
            value={(config.url as string) || ""}
            onChange={(e) => onChange({ ...config, url: e.target.value })}
          />
        </div>
      </div>
      <KeyValueEditor
        label="Headers"
        value={(config.headers as Record<string, string>) || {}}
        onChange={(headers) => onChange({ ...config, headers })}
      />
      {config.method !== "GET" && (
        <div className="space-y-1">
          <Label className="text-xs">Body</Label>
          <Textarea
            placeholder='{"key": "{{value}}"}'
            value={(config.body as string) || ""}
            onChange={(e) => onChange({ ...config, body: e.target.value })}
            className="font-mono text-sm"
            rows={3}
          />
        </div>
      )}
      <div className="space-y-1">
        <Label className="text-xs">Response Mapping</Label>
        <Input
          placeholder="data.results"
          value={(config.responseMapping as string) || ""}
          onChange={(e) => onChange({ ...config, responseMapping: e.target.value })}
        />
      </div>
    </div>
  );
}

function TransformStepConfig({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">Template</Label>
      <Textarea
        placeholder="Found {{results.length}} results: {{#each results}}..."
        value={(config.template as string) || ""}
        onChange={(e) => onChange({ ...config, template: e.target.value })}
        className="font-mono text-sm"
        rows={4}
      />
    </div>
  );
}

function LlmStepConfig({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Provider</Label>
          <Select
            value={(config.provider as string) || "OPENAI"}
            onValueChange={(val) => onChange({ ...config, provider: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPENAI">OpenAI</SelectItem>
              <SelectItem value="ANTHROPIC">Anthropic</SelectItem>
              <SelectItem value="GOOGLE">Google</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Model</Label>
          <Input
            placeholder="gpt-4o-mini"
            value={(config.model as string) || ""}
            onChange={(e) => onChange({ ...config, model: e.target.value })}
          />
        </div>
        <div className="w-[100px] space-y-1">
          <Label className="text-xs">Temperature</Label>
          <Input
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={(config.temperature as number) ?? 0.7}
            onChange={(e) => onChange({ ...config, temperature: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">System Prompt</Label>
        <Textarea
          placeholder="You are a helpful assistant..."
          value={(config.systemPrompt as string) || ""}
          onChange={(e) => onChange({ ...config, systemPrompt: e.target.value })}
          rows={2}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">User Prompt</Label>
        <Textarea
          placeholder="Analyze the following data: {{prev_step}}"
          value={(config.userPrompt as string) || ""}
          onChange={(e) => onChange({ ...config, userPrompt: e.target.value })}
          rows={2}
        />
      </div>
    </div>
  );
}

function CodeStepConfig({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">Handler</Label>
      <Input
        placeholder="myCustomHandler"
        value={(config.handler as string) || ""}
        onChange={(e) => onChange({ ...config, handler: e.target.value })}
      />
    </div>
  );
}

function KnowledgeSearchStepConfig({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">Knowledge Base ID</Label>
        <Input
          placeholder="kb_..."
          value={(config.knowledgeBaseId as string) || ""}
          onChange={(e) => onChange({ ...config, knowledgeBaseId: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Query</Label>
        <Input
          placeholder="{{input.query}}"
          value={(config.query as string) || ""}
          onChange={(e) => onChange({ ...config, query: e.target.value })}
        />
      </div>
      <div className="w-[100px] space-y-1">
        <Label className="text-xs">Top K</Label>
        <Input
          type="number"
          min={1}
          max={20}
          value={(config.topK as number) ?? 5}
          onChange={(e) => onChange({ ...config, topK: parseInt(e.target.value) || 5 })}
        />
      </div>
    </div>
  );
}

function StepConfigEditor({
  step,
  onChange,
}: {
  step: ToolStep;
  onChange: (config: Record<string, unknown>) => void;
}) {
  switch (step.type) {
    case "http":
      return <HttpStepConfig config={step.config} onChange={onChange} />;
    case "transform":
      return <TransformStepConfig config={step.config} onChange={onChange} />;
    case "llm":
      return <LlmStepConfig config={step.config} onChange={onChange} />;
    case "code":
      return <CodeStepConfig config={step.config} onChange={onChange} />;
    case "knowledge_search":
      return <KnowledgeSearchStepConfig config={step.config} onChange={onChange} />;
    default:
      return null;
  }
}

export function StepBuilder({ steps, onChange }: StepBuilderProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(
    new Set(steps.map((_, i) => i)),
  );

  const toggleExpanded = (index: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const addStep = () => {
    const newIndex = steps.length;
    onChange([
      ...steps,
      { name: `step_${newIndex + 1}`, type: "http", config: defaultConfig("http") },
    ]);
    setExpandedSteps((prev) => new Set([...prev, newIndex]));
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
    setExpandedSteps((prev) => {
      const next = new Set<number>();
      prev.forEach((v) => {
        if (v < index) next.add(v);
        else if (v > index) next.add(v - 1);
      });
      return next;
    });
  };

  const updateStep = (index: number, updates: Partial<ToolStep>) => {
    onChange(
      steps.map((s, i) => (i === index ? { ...s, ...updates } : s)),
    );
  };

  const changeStepType = (index: number, type: StepType) => {
    updateStep(index, { type, config: defaultConfig(type) });
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    const updated = [...steps];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isExpanded = expandedSteps.has(index);
        return (
          <div
            key={index}
            className="rounded-lg border border-border overflow-hidden"
          >
            <div
              className="flex items-center gap-2 bg-muted/50 px-3 py-2 cursor-pointer"
              onClick={() => toggleExpanded(index)}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground w-6">
                {index + 1}.
              </span>
              <Badge
                variant="secondary"
                className={cn("text-xs", STEP_TYPE_COLORS[step.type])}
              >
                {step.type}
              </Badge>
              <span className="text-sm font-medium flex-1 truncate">
                {step.name || "Unnamed step"}
              </span>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveStep(index, "up")}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveStep(index, "down")}
                  disabled={index === steps.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeStep(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="space-y-3 p-3">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Step Name</Label>
                    <Input
                      placeholder="fetch_data"
                      value={step.name}
                      onChange={(e) => updateStep(index, { name: e.target.value })}
                    />
                  </div>
                  <div className="w-[180px] space-y-1">
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={step.type}
                      onValueChange={(val) => changeStepType(index, val as StepType)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STEP_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <StepConfigEditor
                  step={step}
                  onChange={(config) => updateStep(index, { config })}
                />
              </div>
            )}
          </div>
        );
      })}

      <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-1">
        <Plus className="h-3 w-3" />
        Add Step
      </Button>
    </div>
  );
}

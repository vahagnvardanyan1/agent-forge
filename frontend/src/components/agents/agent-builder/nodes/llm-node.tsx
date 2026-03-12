"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

type LLMNodeData = {
  label?: string;
  provider?: "openai" | "anthropic" | "google";
  model?: string;
};

type LLMNode = Node<LLMNodeData, "llm">;

const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
};

function LLMNodeComponent({ data, selected }: NodeProps<LLMNode>) {
  const label = data.label ?? "LLM";
  const provider = data.provider ?? "openai";
  const model = data.model ?? "GPT-4o";

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border border-purple-200 bg-white shadow-sm transition-shadow",
        "border-l-4 border-l-purple-500",
        selected && "ring-2 ring-purple-400 shadow-md",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-purple-100 text-purple-600">
          <Brain className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">
            {PROVIDER_LABELS[provider] ?? provider} &middot; {model}
          </p>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-purple-500 !bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-purple-500 !bg-white"
      />
    </div>
  );
}

export const LLMNode = memo(LLMNodeComponent);

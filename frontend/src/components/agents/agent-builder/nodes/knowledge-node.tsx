"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

type KnowledgeNodeData = {
  label?: string;
  source?: string;
  config?: string;
};

type KnowledgeNode = Node<KnowledgeNodeData, "knowledge">;

function KnowledgeNodeComponent({ data, selected }: NodeProps<KnowledgeNode>) {
  const label = data.label ?? "Knowledge Base";
  const config = data.config ?? data.source ?? "Pinecone RAG";

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border border-amber-200 bg-white shadow-sm transition-shadow",
        "border-l-4 border-l-amber-500",
        selected && "ring-2 ring-amber-400 shadow-md",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600">
          <Database className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{config}</p>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-amber-500 !bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-amber-500 !bg-white"
      />
    </div>
  );
}

export const KnowledgeNode = memo(KnowledgeNodeComponent);

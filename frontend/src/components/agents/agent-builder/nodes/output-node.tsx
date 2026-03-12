"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type OutputNodeData = {
  label?: string;
  format?: string;
};

type OutputNode = Node<OutputNodeData, "output">;

function OutputNodeComponent({ data, selected }: NodeProps<OutputNode>) {
  const label = data.label ?? "Output";
  const format = data.format ?? "JSON response";

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border border-green-200 bg-white shadow-sm transition-shadow",
        "border-l-4 border-l-green-500",
        selected && "ring-2 ring-green-400 shadow-md",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-green-100 text-green-600">
          <Send className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{format}</p>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-green-500 !bg-white"
      />
    </div>
  );
}

export const OutputNode = memo(OutputNodeComponent);

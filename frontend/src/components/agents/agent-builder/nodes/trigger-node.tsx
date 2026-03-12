"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type TriggerNodeData = {
  label?: string;
  triggerType?: "webhook" | "schedule" | "manual";
  config?: string;
};

type TriggerNode = Node<TriggerNodeData, "trigger">;

function TriggerNodeComponent({ data, selected }: NodeProps<TriggerNode>) {
  const label = data.label ?? "Trigger";
  const triggerType = data.triggerType ?? "webhook";
  const config = data.config ?? `Type: ${triggerType}`;

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border border-blue-200 bg-white shadow-sm transition-shadow",
        "border-l-4 border-l-blue-500",
        selected && "ring-2 ring-blue-400 shadow-md",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600">
          <Zap className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{config}</p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-blue-500 !bg-white"
      />
    </div>
  );
}

export const TriggerNode = memo(TriggerNodeComponent);

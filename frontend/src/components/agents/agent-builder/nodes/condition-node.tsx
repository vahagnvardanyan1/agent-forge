"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

type ConditionNodeData = {
  label?: string;
  condition?: string;
};

type ConditionNode = Node<ConditionNodeData, "condition">;

function ConditionNodeComponent({ data, selected }: NodeProps<ConditionNode>) {
  const label = data.label ?? "Condition";
  const condition = data.condition ?? "if / else";

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border border-yellow-200 bg-white shadow-sm transition-shadow",
        "border-l-4 border-l-yellow-500",
        selected && "ring-2 ring-yellow-400 shadow-md",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-yellow-100 text-yellow-600">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{condition}</p>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-yellow-500 !bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: "30%" }}
        className="!h-3 !w-3 !border-2 !border-green-500 !bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: "70%" }}
        className="!h-3 !w-3 !border-2 !border-red-500 !bg-white"
      />
    </div>
  );
}

export const ConditionNode = memo(ConditionNodeComponent);

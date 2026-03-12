"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ZapierNodeData = {
  label?: string;
  zapName?: string;
  config?: string;
};

type ZapierNode = Node<ZapierNodeData, "zapier">;

function ZapierNodeComponent({ data, selected }: NodeProps<ZapierNode>) {
  const label = data.label ?? "Zapier";
  const config = data.config ?? data.zapName ?? "Connect a Zap";

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border border-orange-200 bg-white shadow-sm transition-shadow",
        "border-l-4 border-l-orange-500",
        selected && "ring-2 ring-orange-400 shadow-md",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-600">
          <Zap className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{config}</p>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-orange-500 !bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-orange-500 !bg-white"
      />
    </div>
  );
}

export const ZapierNode = memo(ZapierNodeComponent);

"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type WebhookNodeData = {
  label?: string;
  url?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
};

type WebhookNode = Node<WebhookNodeData, "webhook">;

function WebhookNodeComponent({ data, selected }: NodeProps<WebhookNode>) {
  const label = data.label ?? "Webhook";
  const method = data.method ?? "POST";
  const url = data.url ?? "https://...";

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow",
        "border-l-4 border-l-slate-500",
        selected && "ring-2 ring-slate-400 shadow-md",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
          <Globe className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">
            {method} &middot; {url}
          </p>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-slate-500 !bg-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-slate-500 !bg-white"
      />
    </div>
  );
}

export const WebhookNode = memo(WebhookNodeComponent);

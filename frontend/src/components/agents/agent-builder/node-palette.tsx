"use client";

import type { DragEvent } from "react";
import {
  Zap,
  Brain,
  Wrench,
  GitBranch,
  Send,
  Database,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaletteItem {
  type: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
  iconColor: string;
}

interface PaletteCategory {
  name: string;
  items: PaletteItem[];
}

const PALETTE_CATEGORIES: PaletteCategory[] = [
  {
    name: "Triggers",
    items: [
      {
        type: "trigger",
        label: "Trigger",
        icon: Zap,
        accent: "border-l-blue-500",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
    ],
  },
  {
    name: "AI Models",
    items: [
      {
        type: "llm",
        label: "LLM",
        icon: Brain,
        accent: "border-l-purple-500",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
    ],
  },
  {
    name: "Tools",
    items: [
      {
        type: "tool",
        label: "Tool",
        icon: Wrench,
        accent: "border-l-teal-500",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-600",
      },
      {
        type: "knowledge",
        label: "Knowledge Base",
        icon: Database,
        accent: "border-l-amber-500",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
      },
      {
        type: "webhook",
        label: "Webhook",
        icon: Globe,
        accent: "border-l-slate-500",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
      },
      {
        type: "zapier",
        label: "Zapier",
        icon: Zap,
        accent: "border-l-orange-500",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
    ],
  },
  {
    name: "Logic",
    items: [
      {
        type: "condition",
        label: "Condition",
        icon: GitBranch,
        accent: "border-l-yellow-500",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
      },
    ],
  },
  {
    name: "Output",
    items: [
      {
        type: "output",
        label: "Output",
        icon: Send,
        accent: "border-l-green-500",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
    ],
  },
];

function onDragStart(event: DragEvent, nodeType: string) {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
}

export function NodePalette() {
  return (
    <aside className="flex w-56 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border bg-muted/30 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Components
      </p>
      {PALETTE_CATEGORIES.map((category) => (
        <div key={category.name} className="flex flex-col gap-1.5">
          <p className="text-[11px] font-medium text-muted-foreground">
            {category.name}
          </p>
          {category.items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => onDragStart(e, item.type)}
                className={cn(
                  "flex cursor-grab items-center gap-2 rounded-md border border-border bg-white px-2.5 py-2 text-sm shadow-sm transition-colors hover:bg-accent/50 active:cursor-grabbing",
                  "border-l-4",
                  item.accent,
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded",
                    item.iconBg,
                    item.iconColor,
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="truncate font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

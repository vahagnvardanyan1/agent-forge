import type { Metadata } from "next";

import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
};
import { Bot, Workflow, Database, BarChart3 } from "lucide-react";

const OVERVIEW_CARDS = [
  { label: "Total Agents", value: "12", icon: Bot, change: "+3 this month" },
  { label: "Total Executions", value: "1,847", icon: Workflow, change: "+12% from last month" },
  { label: "Knowledge Bases", value: "4", icon: Database, change: "2.4k documents" },
  { label: "API Calls", value: "23.5k", icon: BarChart3, change: "+8% from last month" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your AI agents and platform usage.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_CARDS.map((card) => (
          <Card key={card.label} className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.change}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

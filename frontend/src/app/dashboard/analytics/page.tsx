"use client";

import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, DollarSign } from "lucide-react";

const METRICS = [
  { label: "Total Executions", value: "1,847", icon: BarChart3, trend: "+12%" },
  { label: "Success Rate", value: "94.2%", icon: TrendingUp, trend: "+2.1%" },
  { label: "Avg Duration", value: "2.3s", icon: Clock, trend: "-0.4s" },
  { label: "Total Cost", value: "$42.80", icon: DollarSign, trend: "+$8.20" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Monitor your agent performance and usage.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <Card key={metric.label} className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">{metric.value}</p>
            <p className="mt-1 text-xs text-green-600">{metric.trend} from last month</p>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Execution History</h3>
        <div className="flex h-64 items-center justify-center rounded-lg bg-muted/30">
          <p className="text-sm text-muted-foreground">Charts will render here with Recharts</p>
        </div>
      </Card>
    </div>
  );
}

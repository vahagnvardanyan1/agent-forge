import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";

export default function WorkforcePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workforce</h1>
          <p className="text-muted-foreground">Manage teams of agents that collaborate on complex tasks.</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/dashboard/workforce/new">
            <Plus className="h-4 w-4" />
            New Workforce
          </Link>
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <Users className="h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">No workforces yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Create a team of specialized agents for multi-agent orchestration.</p>
      </div>
    </div>
  );
}

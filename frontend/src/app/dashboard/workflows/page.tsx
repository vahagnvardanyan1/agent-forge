import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflows",
};
import { Button } from "@/components/ui/button";
import { Plus, GitBranch } from "lucide-react";

export default function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">Build and manage LangChain workflow templates.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <GitBranch className="h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">No workflows yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Create reusable workflow templates for your agents.</p>
      </div>
    </div>
  );
}

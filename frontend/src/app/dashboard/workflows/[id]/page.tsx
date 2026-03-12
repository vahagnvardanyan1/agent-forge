import { Card } from "@/components/ui/card";

export default function WorkflowDetailPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Workflow Editor</h1>
      <Card className="h-[calc(100vh-14rem)] p-4">
        <p className="text-sm text-muted-foreground">Workflow editor will be rendered here with React Flow.</p>
      </Card>
    </div>
  );
}

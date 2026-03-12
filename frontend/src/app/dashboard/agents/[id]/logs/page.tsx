import { Card } from "@/components/ui/card";

export default function AgentLogsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Execution Logs</h1>
        <p className="text-muted-foreground">View your agent&apos;s execution history.</p>
      </div>
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No executions yet. Run your agent to see logs here.</p>
      </Card>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AgentSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Settings</h1>
        <p className="text-muted-foreground">Manage agent configuration and access.</p>
      </div>
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Webhook URL</h3>
        <div className="flex gap-2">
          <Input readOnly value="https://api.agentforge.dev/webhooks/agent/..." className="font-mono text-sm" />
          <Button variant="outline">Copy</Button>
        </div>
      </Card>
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-red-500">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">Permanently delete this agent and all its data.</p>
        <Button variant="destructive">Delete Agent</Button>
      </Card>
    </div>
  );
}

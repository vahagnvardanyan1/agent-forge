import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Trello, Globe, Send, Zap, MessageSquare, Gamepad2 } from "lucide-react";

const INTEGRATIONS = [
  { name: "GitHub", description: "Connect repos, create issues and PRs", icon: Github, color: "bg-gray-500/10" },
  { name: "Jira", description: "Manage tickets, sprints, and boards", icon: Trello, color: "bg-blue-500/10" },
  { name: "Vercel", description: "Deploy projects and manage environments", icon: Globe, color: "bg-black/10 dark:bg-white/10" },
  { name: "Telegram", description: "Deploy agents as Telegram bots", icon: Send, color: "bg-sky-500/10" },
  { name: "Zapier", description: "Connect 8,000+ apps via MCP", icon: Zap, color: "bg-orange-500/10" },
  { name: "Slack", description: "Send messages, create channels", icon: MessageSquare, color: "bg-purple-500/10" },
  { name: "Discord", description: "Bot commands and thread management", icon: Gamepad2, color: "bg-indigo-500/10" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect external services to power your agents.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((integration) => (
          <Card key={integration.name} className="flex flex-col p-6">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${integration.color}`}>
                <integration.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{integration.name}</h3>
              </div>
              <Badge variant="outline" className="ml-auto">Disconnected</Badge>
            </div>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{integration.description}</p>
            <Button variant="outline" className="mt-4 w-full">Connect</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

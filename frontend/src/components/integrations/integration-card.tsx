import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IntegrationCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const IntegrationCard = ({
  icon: Icon,
  name,
  description,
  connected,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) => (
  <Card className="flex flex-col p-6">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">{name}</h3>
          <Badge
            variant="secondary"
            className={cn(
              "mt-1",
              connected
                ? "bg-green-500/10 text-green-600"
                : "bg-muted text-muted-foreground"
            )}
          >
            {connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>
    </div>
    <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    <div className="mt-auto pt-4">
      {connected ? (
        <Button variant="outline" size="sm" onClick={onDisconnect}>
          Disconnect
        </Button>
      ) : (
        <Button size="sm" onClick={onConnect}>
          Connect
        </Button>
      )}
    </div>
  </Card>
);

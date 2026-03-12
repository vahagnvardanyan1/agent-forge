"use client";

import { Button } from "@/components/ui/button";
import { Link, Unlink } from "lucide-react";

interface OAuthConnectButtonProps {
  provider: string;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const OAuthConnectButton = ({
  provider,
  connected,
  onConnect,
  onDisconnect,
}: OAuthConnectButtonProps) => {
  if (connected) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onDisconnect}
        className="gap-2"
      >
        <Unlink className="h-4 w-4" />
        Disconnect {provider}
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={onConnect} className="gap-2">
      <Link className="h-4 w-4" />
      Connect {provider}
    </Button>
  );
};

import type { Metadata } from "next";

import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Settings",
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account, billing, and API keys.</p>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Profile</h3>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" disabled />
        </div>
        <Button>Save Changes</Button>
      </Card>

      <Separator />

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">API Keys</h3>
        <p className="text-sm text-muted-foreground">Manage your API keys for programmatic access.</p>
        <Button variant="outline">Generate New Key</Button>
      </Card>

      <Separator />

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Billing</h3>
        <p className="text-sm text-muted-foreground">Current plan: <strong>Free</strong></p>
        <Button>Upgrade to Pro</Button>
      </Card>
    </div>
  );
}

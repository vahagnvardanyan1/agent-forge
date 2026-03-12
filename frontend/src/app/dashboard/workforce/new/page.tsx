import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewWorkforcePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Workforce</h1>
        <p className="text-muted-foreground">Assemble a team of agents for multi-agent orchestration.</p>
      </div>
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label>Workforce Name</Label>
          <Input placeholder="Content Creation Team" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea placeholder="What will this workforce do?" rows={3} />
        </div>
        <Button>Create Workforce</Button>
      </Card>
    </div>
  );
}

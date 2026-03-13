"use client";

import { useRouter } from "next/navigation";
import { Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AgentForm } from "@/components/agents/agent-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateAgent, useCreateFromTemplate } from "@/hooks/use-agents";
import type { CreateAgentInput } from "@/types/agent";

export default function NewAgentPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateAgent();
  const {
    mutate: createFromTemplate,
    isPending: isTemplateLoading,
  } = useCreateFromTemplate();

  const handleSubmit = (data: CreateAgentInput) => {
    mutate(data, {
      onSuccess: (agent) => {
        if (agent?.id) {
          toast.success("Agent created successfully");
          router.push(`/dashboard/agents/${agent.id}`);
        } else {
          toast.error("Could not create agent — database is unavailable. Start Postgres with: npm run setup");
        }
      },
      onError: () => {
        toast.error("Failed to create agent. Check that the backend is running.");
      },
    });
  };

  const handleCreateFromTemplate = () => {
    createFromTemplate("work-finder", {
      onSuccess: (agent) => {
        if (agent?.id) {
          toast.success("Agent created from template");
          router.push(`/dashboard/agents/${agent.id}`);
        } else {
          toast.error("Could not create agent from template.");
        }
      },
      onError: () => {
        toast.error("Failed to create agent from template.");
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Agent</h1>
        <p className="text-muted-foreground">Configure your AI agent&apos;s behavior and capabilities.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Start Templates</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle>Work Finder</CardTitle>
                  <Badge variant="secondary" className="mt-1">career</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI job search assistant that finds positions across LinkedIn, Indeed, Glassdoor. Analyzes your resume, matches skills to requirements.
              </CardDescription>
            </CardContent>
            <CardContent>
              <Button
                onClick={handleCreateFromTemplate}
                disabled={isTemplateLoading}
                className="w-full"
              >
                {isTemplateLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Create from Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or create from scratch</span>
        </div>
      </div>

      <AgentForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}

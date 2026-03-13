"use client";

import { Loader2, MessageCircle, Shield, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { AgentTemplate } from "@/types/template";

interface TemplatePreviewDialogProps {
  template: AgentTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAgent: (template: AgentTemplate) => void;
  isCreating: boolean;
}

export function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
  onCreateAgent,
  isCreating,
}: TemplatePreviewDialogProps) {
  if (!template) return null;

  const guardrails = template.guardrails as {
    do?: string[];
    dont?: string[];
  } | null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
              style={{
                backgroundColor: template.color
                  ? `${template.color}15`
                  : "hsl(var(--primary) / 0.1)",
              }}
            >
              <Wrench
                className="h-5 w-5"
                style={{ color: template.color ?? "hsl(var(--primary))" }}
              />
            </div>
            <div>
              <DialogTitle>{template.displayName}</DialogTitle>
              <DialogDescription className="mt-1">
                {template.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Meta info */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{template.category}</Badge>
            <Badge variant="outline">{template.difficulty}</Badge>
            <Badge variant="outline">
              {template.provider} / {template.model}
            </Badge>
            <Badge variant="outline">temp: {template.temperature}</Badge>
            {template.usageCount > 0 && (
              <Badge variant="outline">
                {template.usageCount} uses
              </Badge>
            )}
          </div>

          {/* Long description */}
          {template.longDescription && (
            <div>
              <h4 className="text-sm font-medium mb-1">About</h4>
              <p className="text-sm text-muted-foreground">
                {template.longDescription}
              </p>
            </div>
          )}

          {/* Tools */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              Tools ({template.toolNames.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {template.toolNames.map((tool) => (
                <Badge key={tool} variant="secondary" className="text-xs">
                  {tool.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>

          {/* Conversation Starters */}
          {template.conversationStarters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" />
                Conversation Starters
              </h4>
              <div className="space-y-1.5">
                {template.conversationStarters.map((starter, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-muted px-3 py-2 text-sm"
                  >
                    &ldquo;{starter}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guardrails */}
          {guardrails && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Guardrails
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {guardrails.do && guardrails.do.length > 0 && (
                  <div className="rounded-md border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 p-3">
                    <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1.5">
                      Always Do
                    </p>
                    <ul className="space-y-1 text-xs text-green-800 dark:text-green-300">
                      {guardrails.do.map((rule, i) => (
                        <li key={i}>&#x2713; {rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {guardrails.dont && guardrails.dont.length > 0 && (
                  <div className="rounded-md border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 p-3">
                    <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1.5">
                      Never Do
                    </p>
                    <ul className="space-y-1 text-xs text-red-800 dark:text-red-300">
                      {guardrails.dont.map((rule, i) => (
                        <li key={i}>&#x2717; {rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Prompt Preview */}
          <div>
            <h4 className="text-sm font-medium mb-1">System Prompt Preview</h4>
            <pre className="whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs font-mono max-h-48 overflow-y-auto">
              {template.systemPrompt.slice(0, 500)}
              {template.systemPrompt.length > 500 ? "..." : ""}
            </pre>
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onCreateAgent(template)}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Create Agent from Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

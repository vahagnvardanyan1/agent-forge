"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TemplateCard, TemplateCardSkeleton } from "./template-card";
import { TemplatePreviewDialog } from "./template-preview-dialog";
import { useTemplates } from "@/hooks/use-templates";
import { useCreateFromTemplate } from "@/hooks/use-agents";
import type { AgentTemplate } from "@/types/template";

export function TemplateGallery() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [previewTemplate, setPreviewTemplate] = useState<AgentTemplate | null>(
    null,
  );
  const [creatingName, setCreatingName] = useState<string | null>(null);

  const { data, isLoading } = useTemplates(selectedCategory);
  const { mutate: createFromTemplate } = useCreateFromTemplate();

  const templates = data?.templates ?? [];

  // Derive categories from data
  const categories = data?.grouped
    ? Object.keys(data.grouped).sort()
    : [];

  const handleCreateAgent = (template: AgentTemplate) => {
    setCreatingName(template.name);
    createFromTemplate(template.name, {
      onSuccess: (agent) => {
        if (agent?.id) {
          toast.success(`${template.displayName} agent created!`);
          router.push(`/dashboard/agents/${agent.id}?chat=true`);
        } else {
          toast.error("Could not create agent.");
          setCreatingName(null);
        }
      },
      onError: () => {
        toast.error("Failed to create agent from template.");
        setCreatingName(null);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button
          variant={selectedCategory === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(undefined)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? undefined : cat)
            }
            className="capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No templates found.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleCreateAgent}
              onPreview={setPreviewTemplate}
              isCreating={creatingName === template.name}
            />
          ))}
        </div>
      )}

      <TemplatePreviewDialog
        template={previewTemplate}
        open={previewTemplate !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewTemplate(null);
        }}
        onCreateAgent={(t) => {
          setPreviewTemplate(null);
          handleCreateAgent(t);
        }}
        isCreating={creatingName === previewTemplate?.name}
      />
    </div>
  );
}

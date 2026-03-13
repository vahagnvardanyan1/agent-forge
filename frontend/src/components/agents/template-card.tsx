"use client";

import {
  Briefcase,
  HeadphonesIcon,
  Code2,
  Search,
  PenTool,
  BarChart3,
  Mail,
  GraduationCap,
  TrendingUp,
  Scale,
  ClipboardList,
  Bot,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AgentTemplate } from "@/types/template";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  career: Briefcase,
  support: HeadphonesIcon,
  development: Code2,
  research: Search,
  content: PenTool,
  data: BarChart3,
  productivity: Mail,
  education: GraduationCap,
  sales: TrendingUp,
  legal: Scale,
};

interface TemplateCardProps {
  template: AgentTemplate;
  onSelect: (template: AgentTemplate) => void;
  onPreview: (template: AgentTemplate) => void;
  isCreating: boolean;
}

export function TemplateCard({
  template,
  onSelect,
  onPreview,
  isCreating,
}: TemplateCardProps) {
  const Icon = CATEGORY_ICONS[template.category] ?? Bot;

  return (
    <Card className="flex flex-col hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{
              backgroundColor: template.color
                ? `${template.color}15`
                : "hsl(var(--primary) / 0.1)",
            }}
          >
            <Icon
              className="h-5 w-5"
              style={{ color: template.color ?? "hsl(var(--primary))" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">
              {template.displayName}
            </CardTitle>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge variant="secondary" className="text-xs">
                {template.category}
              </Badge>
              {template.difficulty !== "beginner" && (
                <Badge variant="outline" className="text-xs">
                  {template.difficulty}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <CardDescription className="line-clamp-2">
          {template.description}
        </CardDescription>
        <div className="mt-3 flex flex-wrap gap-1">
          {template.toolNames.slice(0, 3).map((tool) => (
            <Badge key={tool} variant="outline" className="text-xs font-normal">
              {tool.replace(/_/g, " ")}
            </Badge>
          ))}
          {template.toolNames.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{template.toolNames.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            onClick={() => onSelect(template)}
            disabled={isCreating}
            className="flex-1"
            size="sm"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            Create Agent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(template)}
          >
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TemplateCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded animate-pulse mt-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse mt-1" />
      </CardContent>
      <CardContent className="pt-0">
        <div className="h-8 w-full bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

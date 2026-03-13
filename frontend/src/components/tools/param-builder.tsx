"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ToolParam } from "@/types/tool";

interface ParamBuilderProps {
  params: ToolParam[];
  onChange: (params: ToolParam[]) => void;
}

const PARAM_TYPES = ["string", "number", "boolean"] as const;

export function ParamBuilder({ params, onChange }: ParamBuilderProps) {
  const addParam = () => {
    onChange([
      ...params,
      { name: "", type: "string", description: "", required: false },
    ]);
  };

  const removeParam = (index: number) => {
    onChange(params.filter((_, i) => i !== index));
  };

  const updateParam = (index: number, field: keyof ToolParam, value: string | boolean) => {
    const updated = params.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {params.map((param, index) => (
        <div
          key={index}
          className="flex flex-wrap items-end gap-2 rounded-lg border border-border p-3"
        >
          <div className="flex-1 min-w-[120px] space-y-1">
            <Label className="text-xs">Name</Label>
            <Input
              placeholder="param_name"
              value={param.name}
              onChange={(e) => updateParam(index, "name", e.target.value)}
            />
          </div>
          <div className="w-[120px] space-y-1">
            <Label className="text-xs">Type</Label>
            <Select
              value={param.type}
              onValueChange={(val) => updateParam(index, "type", val as string)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARAM_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-[2] min-w-[160px] space-y-1">
            <Label className="text-xs">Description</Label>
            <Input
              placeholder="Parameter description"
              value={param.description}
              onChange={(e) => updateParam(index, "description", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <Switch
              checked={param.required}
              onCheckedChange={(val) => updateParam(index, "required", val)}
            />
            <Label className="text-xs">Required</Label>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => removeParam(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addParam} className="gap-1">
        <Plus className="h-3 w-3" />
        Add Parameter
      </Button>
    </div>
  );
}

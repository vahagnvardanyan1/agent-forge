"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateAgentInput } from "@/types/agent";

const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  systemPrompt: z.string().min(1, "System prompt is required"),
  provider: z.enum(["OPENAI", "ANTHROPIC", "GOOGLE", "CUSTOM"]).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).optional(),
});

interface AgentFormProps {
  defaultValues?: Partial<CreateAgentInput>;
  onSubmit: (data: CreateAgentInput) => void;
  isLoading?: boolean;
}

export const AgentForm = ({ defaultValues, onSubmit, isLoading }: AgentFormProps) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateAgentInput>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      provider: "OPENAI",
      model: "gpt-4o",
      temperature: 0.7,
      maxTokens: 4096,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Agent Name</Label>
        <Input id="name" {...register("name")} placeholder="My AI Agent" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="What does this agent do?" rows={3} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="systemPrompt">System Prompt</Label>
        <Textarea id="systemPrompt" {...register("systemPrompt")} placeholder="You are a helpful AI assistant..." rows={6} className="font-mono text-sm" />
        {errors.systemPrompt && <p className="text-sm text-red-500">{errors.systemPrompt.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>AI Provider</Label>
          <Select defaultValue="OPENAI" onValueChange={(v: string | null) => setValue("provider", (v ?? undefined) as CreateAgentInput["provider"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="OPENAI">OpenAI</SelectItem>
              <SelectItem value="ANTHROPIC">Anthropic</SelectItem>
              <SelectItem value="GOOGLE">Google</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Model</Label>
          <Select defaultValue="gpt-4o" onValueChange={(v: string | null) => setValue("model", v ?? undefined)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet</SelectItem>
              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature</Label>
          <Input id="temperature" type="number" step="0.1" {...register("temperature", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxTokens">Max Tokens</Label>
          <Input id="maxTokens" type="number" {...register("maxTokens", { valueAsNumber: true })} />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Agent"}
      </Button>
    </form>
  );
};

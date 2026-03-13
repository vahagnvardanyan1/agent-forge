"use client";

import { useState } from "react";
import { Play, Loader2, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTestTool } from "@/hooks/use-tools";
import type { ToolTestResult } from "@/types/tool";

interface ToolTestPanelProps {
  toolName: string;
}

export function ToolTestPanel({ toolName }: ToolTestPanelProps) {
  const [inputJson, setInputJson] = useState("{}");
  const { mutate: testTool, isPending } = useTestTool();
  const [result, setResult] = useState<ToolTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = () => {
    setError(null);
    setResult(null);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(inputJson);
    } catch {
      setError("Invalid JSON input");
      return;
    }

    testTool(
      { name: toolName, input: parsed },
      {
        onSuccess: (data) => setResult(data),
        onError: (err) =>
          setError(
            err instanceof Error ? err.message : "Test failed",
          ),
      },
    );
  };

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Test Tool</h3>
        {result && (
          <Badge variant={result.success ? "secondary" : "destructive"}>
            {result.durationMs}ms
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <Label>Input (JSON)</Label>
        <Textarea
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          className="font-mono text-sm"
          rows={4}
          placeholder='{"query": "test"}'
        />
      </div>

      <Button
        type="button"
        onClick={handleTest}
        disabled={isPending || !toolName}
        className="gap-2"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        Run Test
      </Button>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm font-medium">
              {result.success ? "Success" : "Failed"}
            </span>
          </div>

          {result.stepResults?.map((step, i) => (
            <div
              key={i}
              className="rounded-md border border-border p-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{step.step}</span>
                <Badge variant="secondary">{step.durationMs}ms</Badge>
              </div>
              {step.error && (
                <p className="mt-1 text-destructive">{step.error}</p>
              )}
              {step.output != null && (
                <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                  {typeof step.output === "string"
                    ? step.output
                    : JSON.stringify(step.output, null, 2)}
                </pre>
              )}
            </div>
          ))}

          {result.output != null && !result.stepResults?.length && (
            <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs">
              {typeof result.output === "string"
                ? result.output
                : JSON.stringify(result.output, null, 2)}
            </pre>
          )}

          {result.error && (
            <p className="text-sm text-destructive">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useExecuteAgent } from "@/hooks/use-agents";
import type { ExecutionResult } from "@/hooks/use-agents";

interface Message {
  role: "user" | "assistant";
  content: string;
  meta?: {
    tokens?: number | null;
    cost?: number | null;
    durationMs?: number | null;
  };
}

interface ExecuteAgentDialogProps {
  agentId: string;
  agentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExecuteAgentDialog({
  agentId,
  agentName,
  open,
  onOpenChange,
}: ExecuteAgentDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate, isPending } = useExecuteAgent(agentId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    mutate(trimmed, {
      onSuccess: (result: ExecutionResult) => {
        const content =
          result.status === "COMPLETED" && result.output?.response
            ? result.output.response
            : result.error ?? "No response received.";

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content,
            meta: {
              tokens: result.tokensUsed,
              cost: result.costUsd,
              durationMs: result.durationMs,
            },
          },
        ]);
      },
      onError: (error: Error) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${error.message}` },
        ]);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat with {agentName}</DialogTitle>
          <DialogDescription>
            Send a message to execute the agent and see the response.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 py-4 min-h-0"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bot className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">Send a message to get started</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.meta && msg.role === "assistant" && (
                  <div className="mt-2 flex gap-3 text-xs opacity-60">
                    {msg.meta.tokens != null && (
                      <span>{msg.meta.tokens} tokens</span>
                    )}
                    {msg.meta.cost != null && (
                      <span>${msg.meta.cost.toFixed(6)}</span>
                    )}
                    {msg.meta.durationMs != null && (
                      <span>{(msg.meta.durationMs / 1000).toFixed(1)}s</span>
                    )}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {isPending && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-lg bg-muted px-4 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={2}
            className="resize-none text-sm"
            disabled={isPending}
          />
          <Button
            onClick={handleSend}
            disabled={isPending || !input.trim()}
            size="icon"
            className="shrink-0 self-end"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

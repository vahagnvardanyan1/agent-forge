"use client";

import Link from "next/link";
import { Plus, Database, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKnowledgeBases } from "@/hooks/use-knowledge";

export default function KnowledgePage() {
  const { data: knowledgeBases, isLoading, isError } = useKnowledgeBases();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Bases</h1>
          <p className="text-muted-foreground">Manage your Pinecone-powered document stores for RAG.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Knowledge Base
        </Button>
      </div>

      {isLoading && !isError ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : knowledgeBases?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {knowledgeBases.map((kb) => (
            <Link key={kb.id} href={`/dashboard/knowledge/${kb.id}`}>
              <Card className="p-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Database className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{kb.name}</h3>
                    <p className="text-xs text-muted-foreground">{kb.embeddingModel}</p>
                  </div>
                </div>
                {kb.description && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{kb.description}</p>}
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {kb.documentCount} documents
                  </span>
                  <span>{kb.chunkCount} chunks</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <Database className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No knowledge bases yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Upload documents to create context for your agents.</p>
          <Button className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Create Knowledge Base
          </Button>
        </div>
      )}
    </div>
  );
}

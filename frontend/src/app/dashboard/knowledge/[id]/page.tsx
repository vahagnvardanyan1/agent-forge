"use client";

import { use } from "react";

import { ArrowLeft, Upload, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKnowledgeBase } from "@/hooks/use-knowledge";

export default function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: kb, isLoading, isError } = useKnowledgeBase(id);

  if (isLoading && !isError) return <Skeleton className="h-96 w-full rounded-xl" />;
  if (!kb) return <p>Knowledge base not found.</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/knowledge"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{kb.name}</h1>
          <p className="text-sm text-muted-foreground">{kb.documentCount} documents, {kb.chunkCount} chunks</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{kb.documentCount}</p>
          <p className="text-xs text-muted-foreground">Documents</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{kb.chunkCount}</p>
          <p className="text-xs text-muted-foreground">Chunks</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold font-mono">{kb.embeddingModel}</p>
          <p className="text-xs text-muted-foreground">Embedding Model</p>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Documents</h2>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {kb.documents.length > 0 ? (
        <div className="space-y-2">
          {kb.documents.map((doc) => (
            <Card key={doc.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{doc.filename}</p>
                  <p className="text-xs text-muted-foreground">{(doc.sizeBytes / 1024).toFixed(1)} KB — {doc.chunkCount} chunks</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No documents uploaded yet.</p>
        </Card>
      )}
    </div>
  );
}

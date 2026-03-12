import { Database, FileText, Layers, Tag } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VectorStoreStatsProps {
  documentCount: number;
  chunkCount: number;
  embeddingModel: string;
  namespace: string;
}

const STAT_ITEMS = [
  { key: "documentCount", label: "Documents", icon: FileText },
  { key: "chunkCount", label: "Chunks", icon: Layers },
  { key: "embeddingModel", label: "Embedding Model", icon: Database },
  { key: "namespace", label: "Namespace", icon: Tag },
] as const;

export const VectorStoreStats = ({
  documentCount,
  chunkCount,
  embeddingModel,
  namespace,
}: VectorStoreStatsProps) => {
  const values: Record<string, string | number> = {
    documentCount,
    chunkCount,
    embeddingModel,
    namespace,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {STAT_ITEMS.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium truncate">
                  {typeof values[key] === "number"
                    ? values[key].toLocaleString()
                    : values[key]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

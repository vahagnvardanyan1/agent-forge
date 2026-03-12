"use client";

import { useState } from "react";
import { FileText, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchResult {
  id: string;
  content: string;
  similarityScore: number;
  sourceDocument: string;
}

export const SearchTest = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);

    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setResults([
      {
        id: "1",
        content:
          "This is a sample matched chunk from the knowledge base that is relevant to your query...",
        similarityScore: 0.95,
        sourceDocument: "getting-started.pdf",
      },
      {
        id: "2",
        content:
          "Another relevant chunk with a slightly lower similarity score from a different source...",
        similarityScore: 0.82,
        sourceDocument: "api-reference.md",
      },
    ]);
    setIsSearching(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="shrink-0 gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </p>
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border p-4 space-y-2"
              >
                <p className="text-sm leading-relaxed">{result.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {result.sourceDocument}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      result.similarityScore >= 0.9
                        ? "text-green-600"
                        : result.similarityScore >= 0.7
                          ? "text-yellow-600"
                          : "text-muted-foreground"
                    )}
                  >
                    {(result.similarityScore * 100).toFixed(1)}% match
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !isSearching && query.trim() === "" && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              Enter a query to search your knowledge base
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

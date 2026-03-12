"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "Productivity", "Development", "Marketing", "Customer Support", "Data Analysis", "Writing", "Research"];

interface MarketplaceFiltersProps {
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const MarketplaceFilters = ({ onSearchChange, onCategoryChange }: MarketplaceFiltersProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
    <div className="flex-1 space-y-2">
      <Label>Search</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search agents..." className="pl-9" onChange={(e) => onSearchChange(e.target.value)} />
      </div>
    </div>
    <div className="w-48 space-y-2">
      <Label>Category</Label>
      <Select defaultValue="All" onValueChange={(v: string | null) => onCategoryChange(v ?? "All")}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

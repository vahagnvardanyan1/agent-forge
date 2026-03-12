"use client";

import { Bell, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAppStore, setAppStore } from "@/store";
import type { IAppStore } from "@/store";

const sidebarSelector = (store: IAppStore) => ({
  sidebarOpen: store.sidebarOpen,
});

export const DashboardTopbar = () => {
  const { sidebarOpen } = useAppStore(sidebarSelector);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
          onClick={() => setAppStore({ sidebarOpen: !sidebarOpen })}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search agents, workflows..." className="w-64 pl-9 lg:w-80" />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary/20" />
      </div>
    </header>
  );
};

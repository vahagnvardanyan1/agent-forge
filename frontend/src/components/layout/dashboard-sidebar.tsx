"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Store,
  Puzzle,
  Database,
  GitBranch,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  Zap,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppStore, setAppStore } from "@/store";
import { useAuth } from "@/components/auth-provider";
import type { IAppStore } from "@/store";

const sidebarSelector = (store: IAppStore) => ({
  sidebarCollapsed: store.sidebarCollapsed,
  sidebarOpen: store.sidebarOpen,
});

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Agents", href: "/dashboard/agents", icon: Bot },
  { label: "Marketplace", href: "/dashboard/marketplace", icon: Store },
  { label: "Knowledge", href: "/dashboard/knowledge", icon: Database },
  { label: "Workflows", href: "/dashboard/workflows", icon: GitBranch },
  { label: "Workforce", href: "/dashboard/workforce", icon: Users },
  { label: "Integrations", href: "/dashboard/integrations", icon: Puzzle },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const SidebarContent = ({
  collapsed,
  onNavClick,
}: {
  collapsed: boolean;
  onNavClick?: () => void;
}) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            AgentForge
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-8 w-8 md:inline-flex"
          onClick={() => setAppStore({ sidebarCollapsed: !collapsed })}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-2 py-4">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </>
  );
};

export const DashboardSidebar = () => {
  const { sidebarCollapsed, sidebarOpen } = useAppStore(sidebarSelector);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-screen flex-col border-r border-border bg-card transition-all duration-300 md:flex",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </aside>

      {/* Mobile sidebar (Sheet overlay) */}
      <Sheet
        open={sidebarOpen}
        onOpenChange={(open) => setAppStore({ sidebarOpen: open })}
      >
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent
            collapsed={false}
            onNavClick={() => setAppStore({ sidebarOpen: false })}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

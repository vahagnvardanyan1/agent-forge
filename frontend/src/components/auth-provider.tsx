"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string; name: string | null } | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

/**
 * Wraps dashboard routes. On mount it checks for a valid JWT token.
 * If the token is missing or expired (backend returns 401 on /auth/me),
 * it redirects to /login instead of letting every API call fail individually.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthContextValue["user"]>(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    // Validate the token by calling a lightweight authenticated endpoint
    let cancelled = false;
    api
      .get("/auth/me")
      .then(({ data }) => {
        if (cancelled) return;
        const u = data.data ?? data;
        setUser(u);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // Token is invalid or expired — clear it and redirect
        localStorage.removeItem("token");
        router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  // Show nothing while checking auth — prevents flash of dashboard then redirect
  if (isLoading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, isLoading, user, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

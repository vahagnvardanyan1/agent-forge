"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export const Toaster = () => {
  const { theme } = useTheme();
  return <SonnerToaster theme={theme as "light" | "dark" | "system"} richColors />;
};

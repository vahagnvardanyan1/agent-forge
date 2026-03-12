import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "AgentForge — AI Agent Platform",
    template: "%s | AgentForge",
  },
  description:
    "Build, deploy, and orchestrate AI agents with AgentForge. Visual workflow builder, multi-agent workforce, marketplace, and enterprise integrations.",
  keywords: ["AI agents", "agent builder", "workflow automation", "LLM", "AI platform"],
  openGraph: {
    title: "AgentForge — AI Agent Platform",
    description:
      "Build, deploy, and orchestrate AI agents with AgentForge. Visual workflow builder, multi-agent workforce, marketplace, and enterprise integrations.",
    siteName: "AgentForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

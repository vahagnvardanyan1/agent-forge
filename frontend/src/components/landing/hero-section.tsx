"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

export const HeroSection = () => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
    {/* Dot grid background */}
    <div
      className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
      style={{
        backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />

    {/* Radial glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Now in public beta
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-8xl"
      >
        Build AI Agents{" "}
        <span className="bg-gradient-to-r from-primary to-[hsl(175,80%,40%)] bg-clip-text text-transparent">
          That Actually Work
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl"
      >
        Create, connect, and deploy intelligent AI agents with a visual builder.
        Integrate with GitHub, Jira, Slack, and 8,000+ apps through Zapier.
      </motion.p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <Button size="lg" className="gap-2 text-base" asChild>
            <Link href="/register">
              Start Building — Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
        >
          <Button size="lg" variant="outline" className="gap-2 text-base" asChild>
            <Link href="/docs">
              <Play className="h-4 w-4" />
              View Documentation
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Product Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mx-auto mt-20 max-w-5xl"
      >
        <div className="rounded-xl border border-border bg-card p-2 shadow-2xl shadow-primary/5">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-4 text-xs text-muted-foreground font-mono">agent-builder.tsx</span>
          </div>
          <div className="flex h-64 items-center justify-center overflow-hidden rounded-b-lg bg-muted/30 sm:h-80">
            <div className="flex flex-wrap items-center justify-center gap-3 px-4 sm:flex-nowrap sm:gap-8 sm:px-0">
              {/* Simulated flow nodes */}
              {[
                { label: "Webhook Trigger", color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400" },
                { label: "GPT-4o", color: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400" },
                { label: "GitHub: Create PR", color: "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400" },
                { label: "Output", color: "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400" },
              ].map((node, i) => (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`rounded-lg border px-4 py-3 text-xs font-medium ${node.color}`}>
                    {node.label}
                  </div>
                  {i < 3 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: 48 }}
                      transition={{ delay: 1.0 + i * 0.15 }}
                      className="absolute h-0.5 bg-border"
                      style={{ transform: `translateX(${60 + i * 10}px)` }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

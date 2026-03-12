"use client";

import { motion } from "motion/react";
import { Zap, Brain, Github, GitBranch, Send } from "lucide-react";

const DEMO_NODES = [
  { id: "trigger", label: "Webhook", icon: Zap, color: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400", x: 0, y: 100, slideFrom: "left" as const },
  { id: "llm", label: "GPT-4o", icon: Brain, color: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400", x: 220, y: 100, slideFrom: "left" as const },
  { id: "tool", label: "GitHub: Create PR", icon: Github, color: "border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-400", x: 440, y: 50, slideFrom: "right" as const },
  { id: "condition", label: "Condition", icon: GitBranch, color: "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", x: 440, y: 170, slideFrom: "right" as const },
  { id: "output", label: "Output", icon: Send, color: "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400", x: 660, y: 100, slideFrom: "right" as const },
];

export const WorkflowDemo = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-4xl font-semibold tracking-tight lg:text-5xl">
            Design complex AI workflows visually
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Connect triggers, AI models, tools, and logic with an intuitive drag-and-drop builder.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="relative h-64">
              {/* Edges */}
              <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }}>
                {[
                  { from: "trigger", to: "llm", x1: "14%", y1: "50%", x2: "30%", y2: "50%" },
                  { from: "llm", to: "tool", x1: "42%", y1: "50%", x2: "58%", y2: "28%" },
                  { from: "llm", to: "condition", x1: "42%", y1: "50%", x2: "58%", y2: "72%" },
                  { from: "tool", to: "output", x1: "72%", y1: "28%", x2: "86%", y2: "50%" },
                  { from: "condition", to: "output", x1: "72%", y1: "72%", x2: "86%", y2: "50%" },
                ].map((edge, i) => (
                  <motion.line
                    key={`${edge.from}-${edge.to}`}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                  />
                ))}
              </svg>

              {/* Nodes - slide in from left or right */}
              {DEMO_NODES.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: node.slideFrom === "left" ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                  className={`absolute flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm ${node.color}`}
                  style={{
                    left: `${(node.x / 740) * 100}%`,
                    top: `${(node.y / 240) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 1,
                  }}
                >
                  <node.icon className="h-4 w-4" />
                  {node.label}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

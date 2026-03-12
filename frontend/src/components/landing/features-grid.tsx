"use client";

import { motion } from "motion/react";
import {
  Workflow,
  Brain,
  Database,
  Link2,
  Store,
  Plug,
  Radio,
  Code2,
  Zap,
  Users,
  Shield,
} from "lucide-react";

const FEATURES = [
  { icon: Workflow, title: "Visual Agent Builder", description: "Drag-and-drop flow editor to design agent logic visually with React Flow" },
  { icon: Brain, title: "Multi-Model AI", description: "Claude, GPT-4, Gemini — switch providers in one click, same interface" },
  { icon: Database, title: "Knowledge Base (RAG)", description: "Pinecone-powered document intelligence for context-aware agents" },
  { icon: Link2, title: "LangChain Workflows", description: "Chain complex reasoning with LCEL runnables and tool orchestration" },
  { icon: Store, title: "Marketplace", description: "Publish, discover, and monetize AI agents in the community marketplace" },
  { icon: Plug, title: "Integrations", description: "Connect GitHub, Jira, Vercel, Telegram, Slack, Discord out of the box" },
  { icon: Radio, title: "Real-time Execution", description: "WebSocket streaming with full execution traceability and step logging" },
  { icon: Code2, title: "API Access", description: "REST API and webhooks for headless agent deployment and automation" },
  { icon: Zap, title: "Zapier Automation", description: "Connect 8,000+ apps to your agents via Zapier MCP protocol" },
  { icon: Users, title: "Agent Workforce", description: "Teams of specialized agents that collaborate on complex multi-step tasks" },
  { icon: Shield, title: "Enterprise Ready", description: "Role-based access, audit logs, SSO, and usage-based billing built in" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-4xl font-semibold tracking-tight lg:text-5xl">
            Everything you need to build AI agents
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A complete platform for creating, deploying, and managing intelligent agents at scale.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

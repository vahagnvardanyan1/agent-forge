"use client";

import { motion } from "motion/react";
import { Github, Trello, Globe, Send, Zap, MessageSquare, Gamepad2, Database, Link } from "lucide-react";

const INTEGRATIONS = [
  { name: "GitHub", icon: Github },
  { name: "Jira", icon: Trello },
  { name: "Vercel", icon: Globe },
  { name: "Telegram", icon: Send },
  { name: "Zapier", icon: Zap },
  { name: "Slack", icon: MessageSquare },
  { name: "Discord", icon: Gamepad2 },
  { name: "Pinecone", icon: Database },
  { name: "LangChain", icon: Link },
];

export const IntegrationsShowcase = () => {
  return (
    <section id="integrations" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-semibold tracking-tight lg:text-5xl"
        >
          Connect your entire stack
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
        >
          Connect your tools in minutes, not days. Native integrations plus 8,000+ apps via Zapier.
        </motion.p>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
          {INTEGRATIONS.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: "easeOut" }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card transition-all hover:scale-110 hover:shadow-lg">
                <integration.icon className="h-7 w-7 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{integration.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

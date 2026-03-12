"use client";

import { motion } from "motion/react";

const TESTIMONIALS = [
  {
    quote: "AgentForge replaced our entire internal tooling for AI agents. The visual builder alone saved us weeks of development.",
    name: "Sarah Chen",
    role: "CTO",
    company: "Nexus AI",
  },
  {
    quote: "We deployed 12 customer support agents in a single afternoon. The Zapier integration means they can work with our entire stack.",
    name: "Marcus Rodriguez",
    role: "Head of Engineering",
    company: "ScaleOps",
  },
  {
    quote: "The marketplace is a game-changer. We publish agents for our clients and generate recurring revenue from the platform.",
    name: "Aisha Patel",
    role: "Founder",
    company: "AI Solutions Co",
  },
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
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const Testimonials = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center text-4xl font-semibold tracking-tight lg:text-5xl"
        >
          Trusted by engineering teams
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="rounded-xl border border-border bg-card p-8"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20" />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

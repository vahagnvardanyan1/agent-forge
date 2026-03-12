import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about AgentForge — the platform for building, deploying, and monetizing AI agents accessible to every developer.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About AgentForge</h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        AgentForge is the platform for building, deploying, and monetizing AI agents.
        We believe AI agents should be accessible to every developer — not just ML engineers.
      </p>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        Our visual builder, combined with powerful integrations and a community marketplace,
        makes it possible to go from idea to production agent in minutes.
      </p>
    </div>
  );
}

import type { Metadata } from "next";

import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesGrid } from "@/components/landing/features-grid";

export const metadata: Metadata = {
  title: "AgentForge — Build & Deploy AI Agents",
  description:
    "Build, deploy, and orchestrate AI agents with AgentForge. Visual workflow builder, multi-agent workforce, marketplace, and enterprise integrations.",
};
import { IntegrationsShowcase } from "@/components/landing/integrations-showcase";
import { WorkflowDemo } from "@/components/landing/workflow-demo";
import { StatsCounter } from "@/components/landing/stats-counter";
import { PricingCards } from "@/components/landing/pricing-cards";
import { Testimonials } from "@/components/landing/testimonials";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <IntegrationsShowcase />
      <WorkflowDemo />
      <StatsCounter />
      <PricingCards />
      <Testimonials />
      <CTASection />
    </>
  );
}

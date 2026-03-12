import type { Metadata } from "next";

import { PricingCards } from "@/components/landing/pricing-cards";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the right AgentForge plan for your team. Free, Pro, and Enterprise options with flexible pricing for AI agent building and deployment.",
};

export default function PricingPage() {
  return (
    <div className="pt-24">
      <PricingCards />
    </div>
  );
}

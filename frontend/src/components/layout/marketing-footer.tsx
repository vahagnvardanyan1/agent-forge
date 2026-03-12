import Link from "next/link";
import { Zap, Github, Twitter } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Marketplace", href: "/dashboard/marketplace" },
    { label: "Integrations", href: "#integrations" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Guides", href: "/docs/guides" },
    { label: "Blog", href: "/blog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export const MarketingFooter = () => (
  <footer className="border-t border-border bg-background">
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            AgentForge
          </Link>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Build, deploy, and monetize AI agents with a visual builder and powerful integrations.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
          <div key={category}>
            <h4 className="mb-3 text-sm font-semibold">{category}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AgentForge. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            <Github className="h-4 w-4" />
          </Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            <Twitter className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

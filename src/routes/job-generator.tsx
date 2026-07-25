import { createFileRoute } from "@tanstack/react-router";
import { FileText, Wand2, Languages, ListChecks } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { PagePlaceholder } from "@/components/recruit/PagePlaceholder";

export const Route = createFileRoute("/job-generator")({
  head: () => ({
    meta: [
      { title: "AI Job Generator — RecruitAI OS" },
      { name: "description", content: "Generate structured, inclusive job descriptions in seconds with role-aware AI templates." },
      { property: "og:title", content: "AI Job Generator — RecruitAI OS" },
      { property: "og:description", content: "Generate structured, inclusive job descriptions in seconds with role-aware AI templates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        icon={FileText}
        eyebrow="AI Module"
        title="AI Job Generator"
        description="Create structured, inclusive and SEO-ready job descriptions from a short brief. Reuse templates across teams and locales."
        cards={[
          { title: "Smart templates", description: "Role-aware scaffolds for 200+ job families.", icon: Wand2 },
          { title: "Multilingual", description: "Publish the same role in 30+ languages instantly.", icon: Languages },
          { title: "Compliance checks", description: "Bias, tone and legal-language linting built-in.", icon: ListChecks },
        ]}
      />
    </AppShell>
  ),
});

import { createFileRoute } from "@tanstack/react-router";
import { Users, Brain, Target, Layers } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { PagePlaceholder } from "@/components/recruit/PagePlaceholder";

export const Route = createFileRoute("/candidate-analyzer")({
  head: () => ({
    meta: [
      { title: "Candidate Analyzer — RecruitAI OS" },
      { name: "description", content: "Rank, score and compare candidates with explainable AI signals across skills, culture and intent." },
      { property: "og:title", content: "Candidate Analyzer — RecruitAI OS" },
      { property: "og:description", content: "Rank, score and compare candidates with explainable AI signals across skills, culture and intent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        icon={Users}
        eyebrow="AI Module"
        title="Candidate Analyzer"
        description="Understand every applicant in seconds. Explainable scoring, deep skill mapping and side-by-side comparisons at scale."
        cards={[
          { title: "Explainable scoring", description: "See the exact signals behind every match.", icon: Brain },
          { title: "Fit modeling", description: "Blend hard skills, culture and role trajectory.", icon: Target },
          { title: "Bulk pipelines", description: "Analyze thousands of CVs in a single run.", icon: Layers },
        ]}
      />
    </AppShell>
  ),
});

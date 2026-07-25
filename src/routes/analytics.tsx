import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Filter, PieChart } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { PagePlaceholder } from "@/components/recruit/PagePlaceholder";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — RecruitAI OS" },
      { name: "description", content: "Pipeline velocity, sourcing ROI and DEI insights — every hiring signal in one board." },
      { property: "og:title", content: "Analytics — RecruitAI OS" },
      { property: "og:description", content: "Pipeline velocity, sourcing ROI and DEI insights — every hiring signal in one board." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        icon={BarChart3}
        eyebrow="Insights"
        title="Analytics"
        description="Executive-grade dashboards to measure pipeline velocity, sourcing ROI and diversity outcomes in real time."
        cards={[
          { title: "Pipeline velocity", description: "Bottleneck detection across every stage.", icon: TrendingUp },
          { title: "Custom cohorts", description: "Slice by role, region, source or recruiter.", icon: Filter },
          { title: "DEI insights", description: "Track representation without exposing PII.", icon: PieChart },
        ]}
      />
    </AppShell>
  ),
});

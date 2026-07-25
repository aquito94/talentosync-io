import { createFileRoute } from "@tanstack/react-router";
import { Bot, MessagesSquare, Workflow, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { PagePlaceholder } from "@/components/recruit/PagePlaceholder";

export const Route = createFileRoute("/recruit-copilot")({
  head: () => ({
    meta: [
      { title: "Recruit Copilot — RecruitAI OS" },
      { name: "description", content: "Your always-on AI recruiting partner: drafts, decisions, next-best-actions across your whole pipeline." },
      { property: "og:title", content: "Recruit Copilot — RecruitAI OS" },
      { property: "og:description", content: "Your always-on AI recruiting partner: drafts, decisions, next-best-actions across your whole pipeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        icon={Bot}
        eyebrow="Copilot"
        title="Recruit Copilot"
        description="A conversational AI teammate that drafts, decides and orchestrates recruiting workflows without leaving the platform."
        cards={[
          { title: "Conversational ops", description: "Ask, delegate and execute in natural language.", icon: MessagesSquare },
          { title: "Workflow automations", description: "Trigger multi-step actions across your ATS.", icon: Workflow },
          { title: "Enterprise-safe", description: "Guardrails, audit trails and role-aware access.", icon: ShieldCheck },
        ]}
      />
    </AppShell>
  ),
});

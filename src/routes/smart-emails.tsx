import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send, Inbox, Calendar } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { PagePlaceholder } from "@/components/recruit/PagePlaceholder";

export const Route = createFileRoute("/smart-emails")({
  head: () => ({
    meta: [
      { title: "Smart Emails — RecruitAI OS" },
      { name: "description", content: "Personalized outreach at scale: sequences, replies and scheduling powered by candidate context." },
      { property: "og:title", content: "Smart Emails — RecruitAI OS" },
      { property: "og:description", content: "Personalized outreach at scale: sequences, replies and scheduling powered by candidate context." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        icon={Mail}
        eyebrow="Outreach"
        title="Smart Emails"
        description="Send highly personalized outreach at scale. AI adapts tone, timing and content to each candidate stage."
        cards={[
          { title: "Sequences", description: "Multi-step nurtures with automatic pauses.", icon: Send },
          { title: "Unified inbox", description: "All conversations across channels in one view.", icon: Inbox },
          { title: "Smart scheduling", description: "Book interviews with zero back-and-forth.", icon: Calendar },
        ]}
      />
    </AppShell>
  ),
});

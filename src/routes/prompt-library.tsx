import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Bookmark, Share2, Star } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { PagePlaceholder } from "@/components/recruit/PagePlaceholder";

export const Route = createFileRoute("/prompt-library")({
  head: () => ({
    meta: [
      { title: "Prompt Library — RecruitAI OS" },
      { name: "description", content: "Curated, versioned and shareable prompts for sourcing, screening and interviewing at enterprise scale." },
      { property: "og:title", content: "Prompt Library — RecruitAI OS" },
      { property: "og:description", content: "Curated, versioned and shareable prompts for sourcing, screening and interviewing at enterprise scale." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        icon={BookOpen}
        eyebrow="Knowledge"
        title="Prompt Library"
        description="A governed catalogue of prompts your team can reuse, remix and share across every AI module."
        cards={[
          { title: "Versioned prompts", description: "Track changes with full audit history.", icon: Bookmark },
          { title: "Team sharing", description: "Publish templates across squads and BUs.", icon: Share2 },
          { title: "Curated by experts", description: "Handcrafted playbooks for top workflows.", icon: Star },
        ]}
      />
    </AppShell>
  ),
});

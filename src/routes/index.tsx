import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/recruit/AppShell";
import { Dashboard } from "@/components/recruit/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — RecruitAI OS" },
      { name: "description", content: "Real-time hiring pipeline, AI screening activity and team performance in one command center." },
      { property: "og:title", content: "Dashboard — RecruitAI OS" },
      { property: "og:description", content: "Real-time hiring pipeline, AI screening activity and team performance in one command center." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}

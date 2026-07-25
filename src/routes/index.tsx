import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/recruit/AppSidebar";
import { TopBar } from "@/components/recruit/TopBar";
import { Dashboard } from "@/components/recruit/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RecruitAI OS — Enterprise AI Recruiting Platform" },
      {
        name: "description",
        content:
          "RecruitAI OS es la plataforma enterprise de reclutamiento con IA: screening automatizado, entrevistas inteligentes y analytics de pipeline en tiempo real.",
      },
      { property: "og:title", content: "RecruitAI OS — Enterprise AI Recruiting" },
      {
        property: "og:description",
        content:
          "Automatiza selección, entrevistas y outreach con un copiloto de IA diseñado para equipos de talento de alto rendimiento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-w-0 flex-1">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

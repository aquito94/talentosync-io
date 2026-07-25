import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/recruit/AppShell";
import { Dashboard } from "@/components/recruit/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inicio — RecruitAI OS" },
      { name: "description", content: "Flujo de contratación en tiempo real, actividad de evaluación IA y desempeño del equipo en un solo centro de mando." },
      { property: "og:title", content: "Inicio — RecruitAI OS" },
      { property: "og:description", content: "Flujo de contratación en tiempo real, actividad de evaluación IA y desempeño del equipo en un solo centro de mando." },
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

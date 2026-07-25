import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Search, Sparkles, Copy, Star, Users, Mail, FileText, Bot, Filter, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/prompt-library")({
  head: () => ({
    meta: [
      { title: "Biblioteca de Prompts — RecruitAI OS" },
      { name: "description", content: "Prompts curados, versionados y compartibles para búsqueda, evaluación y entrevistas a escala empresarial." },
      { property: "og:title", content: "Biblioteca de Prompts — RecruitAI OS" },
      { property: "og:description", content: "Prompts curados, versionados y compartibles para búsqueda, evaluación y entrevistas a escala empresarial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PromptLibraryPage,
});

const categories = [
  { icon: BookOpen, label: "Todos", count: 128 },
  { icon: Users, label: "Búsqueda", count: 42 },
  { icon: FileText, label: "Vacantes", count: 28 },
  { icon: Mail, label: "Contacto", count: 34 },
  { icon: Bot, label: "Evaluación", count: 18 },
  { icon: Sparkles, label: "Entrevistas", count: 6 },
];

const prompts = [
  { title: "Búsqueda booleana — Ingenieros Senior", category: "Búsqueda", stars: 128, uses: "4.2k", author: "Equipo RecruitAI", curated: true },
  { title: "Contacto en frío — Cercano y personal", category: "Contacto", stars: 96, uses: "3.1k", author: "Elena Ruiz" },
  { title: "Llamada de evaluación — Devs con visión de producto", category: "Evaluación", stars: 74, uses: "2.4k", author: "David Chen" },
  { title: "Reescritura de vacante — Lenguaje inclusivo", category: "Vacantes", stars: 152, uses: "5.8k", author: "Equipo RecruitAI", curated: true },
  { title: "Secuencia de seguimiento — 5 mensajes", category: "Contacto", stars: 62, uses: "1.9k", author: "Aisha Khan" },
  { title: "Ficha de entrevista — Ingeniería Staff", category: "Entrevistas", stars: 48, uses: "1.2k", author: "Mateo Silva" },
  { title: "Búsqueda de diversidad — EMEA", category: "Búsqueda", stars: 88, uses: "2.7k", author: "Equipo RecruitAI", curated: true },
  { title: "Rechazo con retroalimentación", category: "Contacto", stars: 34, uses: "980", author: "Nina Larsson" },
  { title: "Verificación de referencias — Liderazgo", category: "Evaluación", stars: 41, uses: "820", author: "Julien Petit" },
];

function PromptLibraryPage() {
  const [active, setActive] = useState("Todos");
  const list = active === "Todos" ? prompts : prompts.filter((p) => p.category === active);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-float-up">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Biblioteca de Prompts</h1>
            <p className="mt-1 text-sm text-muted-foreground">128 prompts curados · versionados · compartidos en tu organización</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <input placeholder="Buscar prompts…" className="w-48 bg-transparent text-foreground outline-none" />
            </div>
            <button className="rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-sm">
              <Filter className="mr-2 inline h-4 w-4" /> Filtrar
            </button>
            <button className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow">
              <Plus className="mr-2 inline h-4 w-4" /> Nuevo prompt
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="glass-panel h-fit rounded-2xl p-3">
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c.label}>
                  <button
                    onClick={() => setActive(c.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active === c.label ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-surface/40 hover:text-foreground"}`}
                  >
                    <c.icon className="h-4 w-4" />
                    <span className="flex-1 text-left font-medium">{c.label}</span>
                    <span className="text-[10px] text-muted-foreground">{c.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => (
              <article key={p.title} className="group glass-panel rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-glow animate-float-up" style={{ animationDelay: `${i * 30}ms` }}>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{p.category}</span>
                  {p.curated && (
                    <span className="rounded-md gradient-primary px-2 py-0.5 text-[9px] font-bold uppercase text-white shadow-glow">Curado</span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 line-clamp-3 rounded-lg border border-border/40 bg-surface/30 p-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  Eres un reclutador experto. A partir del brief de rol siguiente, genera…
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                  <span className="truncate">por {p.author}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-primary" /> {p.stars}</span>
                    <span>{p.uses}</span>
                    <button className="rounded-md border border-border-strong bg-surface/60 p-1 hover:text-foreground">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

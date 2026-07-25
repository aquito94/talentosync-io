import { useState } from "react";
import {
  Search,
  Filter,
  Star,
  Sparkles,
  TrendingUp,
  Award,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/candidate-analyzer")({
  head: () => ({
    meta: [
      { title: "Evaluador Inteligente de Candidatos — RecruitAI OS" },
      { name: "description", content: "Clasifica, puntúa y compara candidatos con señales explicables de IA sobre habilidades, cultura e intención." },
      { property: "og:title", content: "Evaluador Inteligente de Candidatos — RecruitAI OS" },
      { property: "og:description", content: "Clasifica, puntúa y compara candidatos con señales explicables de IA sobre habilidades, cultura e intención." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CandidateAnalyzerPage,
});

const candidates = [
  { id: 1, name: "Elena Ruiz", role: "Ingeniera Frontend Senior", location: "Madrid, ES", score: 96, status: "Mejor coincidencia", years: 8, avatar: "ER" },
  { id: 2, name: "David Chen", role: "Ingeniero Full-Stack", location: "Berlín, DE", score: 92, status: "Fuerte", years: 6, avatar: "DC" },
  { id: 3, name: "Aisha Khan", role: "Ingeniera Staff", location: "Londres, UK", score: 89, status: "Fuerte", years: 10, avatar: "AK" },
  { id: 4, name: "Mateo Silva", role: "Ingeniero Backend Senior", location: "Lisboa, PT", score: 84, status: "Revisar", years: 7, avatar: "MS" },
  { id: 5, name: "Nina Larsson", role: "Ingeniera Frontend", location: "Estocolmo, SE", score: 78, status: "Revisar", years: 4, avatar: "NL" },
  { id: 6, name: "Julien Petit", role: "Ingeniero Full-Stack", location: "París, FR", score: 74, status: "Considerar", years: 5, avatar: "JP" },
];

const skills = [
  { name: "React / TypeScript", score: 98 },
  { name: "Diseño de sistemas", score: 92 },
  { name: "Liderazgo de equipo", score: 88 },
  { name: "Visión de producto", score: 85 },
  { name: "Comunicación", score: 94 },
];

function CandidateAnalyzerPage() {
  const [selectedId, setSelectedId] = useState(1);
  const selected = candidates.find((c) => c.id === selectedId)!;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1500px] px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-float-up">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> Módulo IA
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Evaluador Inteligente de Candidatos</h1>
            <p className="mt-1 text-sm text-muted-foreground">1.248 candidatos · puntuados por señales explicables de IA</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <input placeholder="Buscar candidatos…" className="w-52 bg-transparent outline-none text-foreground text-sm" />
            </div>
            <button className="rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-sm font-medium">
              <Filter className="mr-2 inline h-4 w-4" /> Filtros
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* List */}
          <div className="glass-panel rounded-2xl overflow-hidden animate-float-up">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <span>Candidato</span>
              <span className="hidden md:inline">Puntaje IA</span>
            </div>
            <ul>
              {candidates.map((c) => {
                const active = c.id === selectedId;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full items-center gap-4 border-b border-border/40 px-5 py-4 text-left transition ${active ? "bg-primary/10" : "hover:bg-surface/40"}`}
                    >
                      <div className={`grid h-10 w-10 place-items-center rounded-xl text-xs font-semibold ${active ? "gradient-primary text-white shadow-glow" : "bg-surface-elevated text-foreground/80"}`}>
                        {c.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{c.name}</span>
                          <StatusPill status={c.status} />
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground truncate">
                          {c.role} · {c.location} · {c.years} años
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col items-end gap-1 w-40">
                        <span className="text-xs font-semibold gradient-text">{c.score}</span>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                          <div className="h-full rounded-full gradient-primary" style={{ width: `${c.score}%` }} />
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail */}
          <aside className="glass-panel rounded-2xl p-6 animate-float-up" style={{ animationDelay: "60ms" }}>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-sm font-semibold text-white shadow-glow">
                {selected.avatar}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold truncate">{selected.name}</h2>
                <p className="text-xs text-muted-foreground truncate">{selected.role}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-semibold gradient-text">{selected.score}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Coincidencia IA</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <MiniStat icon={Briefcase} label="Experiencia" value={`${selected.years}a`} />
              <MiniStat icon={MapPin} label="Zona" value="UE" />
              <MiniStat icon={GraduationCap} label="Nivel" value="Senior" />
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Desglose de habilidades</h3>
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="space-y-3">
                {skills.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs">
                      <span>{s.name}</span>
                      <span className="text-muted-foreground">{s.score}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                      <div className="h-full rounded-full gradient-primary" style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border-strong bg-surface/40 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Award className="h-4 w-4 text-primary" /> Recomendación de la IA
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                El perfil de Elena tiene un 96% de alineación con tu vacante de Frontend Senior. Fuertes indicadores culturales y liderazgo demostrado en equipos SaaS de alto crecimiento. Avanzar a entrevista.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Referencias verificadas
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-xl gradient-primary py-2.5 text-sm font-semibold text-white shadow-glow">
                <Star className="mr-2 inline h-4 w-4" /> Preseleccionar
              </button>
              <button className="rounded-xl border border-border-strong bg-surface/60 px-3 py-2.5 text-sm">
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Mejor coincidencia": "bg-primary/15 text-primary",
    Fuerte: "bg-success/15 text-success",
    Revisar: "bg-warning/15 text-warning",
    Considerar: "bg-muted/40 text-muted-foreground",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[status]}`}>{status}</span>;
}

function MiniStat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-strong bg-surface/40 p-3">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <div className="mt-1 text-sm font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

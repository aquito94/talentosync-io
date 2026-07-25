import { useState } from "react";
import {
  Users,
  Upload,
  Sparkles,
  FileText,
  Building2,
  MapPin,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Search,
  MessageSquareQuote,
  ShieldAlert,
  Eye,
  Award,
  Scale,
  Users2,
  UserSearch,
  BarChart3,
  Star,
  Download,
  Trash2,
  FileType2,
  ChevronRight,
  Target,
  Cpu,
  Heart,
} from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/candidate-analyzer")({
  head: () => ({
    meta: [
      { title: "Evaluador Inteligente de Candidatos — RecruitAI OS" },
      { name: "description", content: "Analiza múltiples CV con IA, obtén compatibilidad, competencias, riesgos y preguntas STAR listas para entrevista." },
      { property: "og:title", content: "Evaluador Inteligente de Candidatos — RecruitAI OS" },
      { property: "og:description", content: "Analiza múltiples CV con IA, obtén compatibilidad, competencias, riesgos y preguntas STAR listas para entrevista." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CandidateAnalyzerPage,
});

type Candidate = {
  id: string;
  name: string;
  role: string;
  file: string;
  score: number;
  skills: string[];
  location: string;
  years: number;
  status: "Alta" | "Media" | "Baja";
};

const initialCandidates: Candidate[] = [
  { id: "1", name: "Elena Ruiz Martín", role: "Senior Frontend Engineer", file: "elena-ruiz-cv.pdf", score: 96, skills: ["React", "TypeScript", "GraphQL", "AWS"], location: "Madrid, ES", years: 7, status: "Alta" },
  { id: "2", name: "David Chen", role: "Senior Frontend Engineer", file: "david-chen-cv.pdf", score: 92, skills: ["React", "Next.js", "Node", "GCP"], location: "Barcelona, ES", years: 6, status: "Alta" },
  { id: "3", name: "Aisha Khan", role: "Frontend Engineer", file: "aisha-khan-cv.docx", score: 89, skills: ["Vue", "TypeScript", "Design Systems"], location: "Remoto, PT", years: 5, status: "Alta" },
  { id: "4", name: "Mateo Silva", role: "Fullstack Engineer", file: "mateo-silva-cv.pdf", score: 84, skills: ["React", "Python", "PostgreSQL"], location: "Valencia, ES", years: 4, status: "Media" },
  { id: "5", name: "Nina Larsson", role: "UI Engineer", file: "nina-larsson-cv.pdf", score: 78, skills: ["React", "Tailwind", "Motion"], location: "Remoto, SE", years: 3, status: "Media" },
  { id: "6", name: "Julien Petit", role: "Frontend Developer", file: "julien-petit-cv.docx", score: 71, skills: ["Angular", "RxJS", "TypeScript"], location: "Lyon, FR", years: 4, status: "Media" },
];

const quickActions = [
  { icon: Cpu, title: "Detectar competencias ocultas", desc: "Encuentra habilidades transferibles no evidentes en el CV." },
  { icon: Scale, title: "Comparar candidatos", desc: "Enfrenta hasta 5 perfiles con matriz de decisión ponderada." },
  { icon: ShieldAlert, title: "Detectar riesgos", desc: "Detecta gaps, rotación alta o sobrecalificación." },
  { icon: MessageSquareQuote, title: "Generar preguntas STAR", desc: "Preguntas personalizadas por competencia y candidato." },
  { icon: Heart, title: "Calcular ajuste cultural", desc: "Estima el fit con los valores y cultura de la empresa." },
];

function CandidateAnalyzerPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1600);
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1600px] px-6 py-8">
        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between animate-float-up">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3 w-3" /> Módulo IA
            </div>
            <h1 className="mt-3 truncate text-3xl font-semibold tracking-tight md:text-4xl">
              Evaluador Inteligente de Candidatos
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              Sube múltiples CV, deja que la IA los analice contra tu vacante y prioriza al mejor talento en minutos.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setCompareOpen(true)}
              className="rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
            >
              <Scale className="mr-2 inline h-3.5 w-3.5" /> Comparar
            </button>
            <button className="rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
              <Download className="mr-2 inline h-3.5 w-3.5" /> Exportar
            </button>
          </div>
        </div>

        {/* Main 3-column grid */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          {/* LEFT: process info */}
          <aside className="glass-panel h-fit rounded-2xl p-5 animate-float-up">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 text-primary" /> Proceso de selección
            </div>
            <h2 className="mt-2 text-base font-semibold tracking-tight">Ingeniero Senior Frontend</h2>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
              Proceso activo · 12 candidatos
            </div>

            <div className="mt-5 space-y-4">
              <InfoRow icon={Briefcase} label="Vacante" value="Ingeniero Senior Frontend" />
              <InfoRow icon={Building2} label="Empresa" value="Nova Retail Group" />
              <InfoRow icon={Layers} label="Departamento" value="Tecnología · Plataforma" />
              <InfoRow icon={MapPin} label="Ubicación" value="Madrid, España · Híbrido" />
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-border-strong bg-surface/40 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Descripción del cargo
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Sube el PDF/DOCX o vincula la vacante generada con IA para mejorar la precisión del análisis.
              </p>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-2 text-xs font-semibold text-white shadow-glow">
                <Upload className="h-3.5 w-3.5" /> Subir descripción
              </button>
              <button className="mt-2 w-full rounded-xl border border-border-strong bg-surface/60 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                Vincular vacante existente
              </button>
            </div>

            <div className="mt-5 border-t border-border/50 pt-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Criterios de evaluación</div>
              <ul className="mt-2 space-y-2 text-xs">
                {[
                  ["Experiencia técnica", 35],
                  ["Habilidades blandas", 20],
                  ["Ajuste cultural", 20],
                  ["Trayectoria", 15],
                  ["Formación", 10],
                ].map(([label, w]) => (
                  <li key={label as string} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{w}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CENTER: Upload + candidates */}
          <section className="space-y-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              className={`glass-panel relative overflow-hidden rounded-2xl p-8 text-center transition animate-float-up ${
                dragOver ? "border-primary/60 shadow-glow" : ""
              }`}
            >
              <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-hero)" }} />
              <div className="relative">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">Arrastra los CV aquí</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Acepta múltiples archivos PDF y DOCX · hasta 20MB por archivo
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-glow">
                    <Upload className="h-3.5 w-3.5" /> Seleccionar archivos
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                    Importar desde LinkedIn
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><FileType2 className="h-3 w-3" /> PDF</span>
                  <span className="inline-flex items-center gap-1"><FileType2 className="h-3 w-3" /> DOCX</span>
                  <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Cifrado end-to-end</span>
                </div>
              </div>
            </div>

            {/* Loaded candidates */}
            <div className="glass-panel rounded-2xl p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold tracking-tight">Candidatos cargados</h3>
                  <p className="text-[11px] text-muted-foreground">{candidates.length} archivos listos para analizar</p>
                </div>
                <button className="shrink-0 text-[11px] font-semibold text-muted-foreground hover:text-foreground">Limpiar todo</button>
              </div>

              <ul className="mt-4 space-y-2">
                {candidates.map((c) => (
                  <li
                    key={c.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-surface/40 p-3"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                      <FileType2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{c.file}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{c.name} · {(Math.random() * 1 + 0.4).toFixed(1)} MB</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="rounded-md bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">Listo</span>
                      <button
                        onClick={() => setCandidates(candidates.filter((x) => x.id !== c.id))}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border/50 pt-5 sm:flex sm:justify-between">
                <div className="min-w-0 text-[11px] text-muted-foreground">
                  Tiempo estimado: <span className="font-semibold text-foreground">~12s</span> · Modelo: <span className="font-semibold text-foreground">RecruitAI GPT-Enterprise</span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-70"
                >
                  {analyzing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Analizando…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analizar Candidatos con IA
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Copilot */}
          <aside className="space-y-4">
            <div className="glass-panel relative overflow-hidden rounded-2xl p-5 animate-float-up">
              <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-hero)" }} />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-glow">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">Copiloto IA</div>
                    <div className="text-[11px] text-muted-foreground">Acciones inteligentes sobre tus candidatos</div>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Aplica análisis avanzados sobre uno o varios candidatos. El copiloto aprende de tus decisiones para afinar recomendaciones.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-3">
              <div className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Acciones rápidas
              </div>
              <ul className="space-y-1.5">
                {quickActions.map((a, i) => (
                  <li key={a.title}>
                    <button
                      className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-transparent bg-surface/40 p-3 text-left transition hover:border-primary/40 hover:bg-primary/5 animate-float-up"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-white">
                        <a.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground">{a.title}</span>
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">{a.desc}</span>
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Salud del pipeline</div>
                <span className="text-[10px] font-semibold text-success">Saludable</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                {[
                  ["12", "Total", "text-foreground"],
                  ["7", "Alta", "text-success"],
                  ["3", "Media", "text-primary"],
                ].map(([v, l, c]) => (
                  <div key={l} className="rounded-xl border border-border/60 bg-surface/40 p-2.5">
                    <div className={`text-lg font-semibold ${c}`}>{v}</div>
                    <div className="text-[10px] text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Results */}
        <section className="mt-10">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:flex sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold tracking-tight">Candidatos analizados</h2>
              <p className="text-xs text-muted-foreground">Ordenados por compatibilidad con la vacante</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-[11px]">
              <div className="hidden items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-muted-foreground sm:flex">
                <Search className="h-3.5 w-3.5" />
                <input placeholder="Filtrar candidatos…" className="w-36 bg-transparent outline-none placeholder:text-muted-foreground" />
              </div>
              <button
                onClick={() => setCompareOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-3 py-2 font-semibold text-muted-foreground transition hover:text-foreground"
              >
                <Scale className="h-3.5 w-3.5" /> Comparar Candidatos
              </button>
            </div>
          </div>

          {!analyzed ? (
            <div className="glass-panel mt-5 flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
                <UserSearch className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Aún no se ha ejecutado el análisis</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Pulsa "Analizar Candidatos con IA" para obtener un ranking por compatibilidad, competencias detectadas y recomendaciones personalizadas.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {candidates.map((c, i) => (
                <CandidateCard key={c.id} c={c} onOpen={() => setSelected(c)} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Detail drawer */}
      {selected && <DetailDrawer c={selected} onClose={() => setSelected(null)} />}

      {/* Compare modal */}
      {compareOpen && <CompareModal candidates={candidates.slice(0, 4)} onClose={() => setCompareOpen(false)} />}
    </AppShell>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface/60 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function CandidateCard({ c, onOpen, index }: { c: Candidate; onOpen: () => void; index: number }) {
  const color = c.score >= 90 ? "text-success" : c.score >= 80 ? "text-primary" : "text-warning";
  const initials = c.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <article
      className="group glass-panel flex flex-col rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-glow animate-float-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-primary text-sm font-semibold text-white shadow-glow">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight">{c.name}</h3>
          <p className="truncate text-[11px] text-muted-foreground">{c.role} · {c.location}</p>
        </div>
        <span className={`shrink-0 rounded-md bg-surface/60 px-2 py-0.5 text-[10px] font-semibold ${
          c.status === "Alta" ? "text-success" : c.status === "Media" ? "text-primary" : "text-warning"
        }`}>
          {c.status}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Compatibilidad</span>
          <span className={`font-semibold ${color}`}>{c.score}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-background/60">
          <div className="h-full rounded-full gradient-primary" style={{ width: `${c.score}%` }} />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Competencias</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {c.skills.map((s) => (
            <span key={s} className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-foreground">{s}</span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4 text-[11px] text-muted-foreground">
        <span>{c.years} años de experiencia</span>
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-2.5 py-1.5 font-semibold text-foreground transition group-hover:bg-primary group-hover:text-white"
        >
          <Eye className="h-3.5 w-3.5" /> Ver análisis
        </button>
      </div>
    </article>
  );
}

function DetailDrawer({ c, onClose }: { c: Candidate; onClose: () => void }) {
  const criteria = [
    { label: "Experiencia técnica", val: 96 },
    { label: "Habilidades blandas", val: 88 },
    { label: "Ajuste cultural", val: 92 },
    { label: "Trayectoria", val: 84 },
    { label: "Formación", val: 90 },
  ];
  const initials = c.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-border/60 bg-background animate-float-up">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border/60 bg-background/80 p-5 backdrop-blur-xl">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-primary text-sm font-semibold text-white shadow-glow">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold">{c.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{c.role} · {c.location} · {c.years} años</div>
            </div>
            <button onClick={onClose} className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-border/60 bg-surface/40 p-2.5">
              <div className="text-lg font-semibold text-success">{c.score}%</div>
              <div className="text-[10px] text-muted-foreground">Compatibilidad</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/40 p-2.5">
              <div className="text-lg font-semibold text-primary">92%</div>
              <div className="text-[10px] text-muted-foreground">Ajuste cultural</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/40 p-2.5">
              <div className="text-lg font-semibold">A+</div>
              <div className="text-[10px] text-muted-foreground">Recomendación</div>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5">
          <Block icon={FileText} title="Resumen ejecutivo">
            <p>
              {c.name} es un perfil altamente compatible con la vacante de Ingeniero Senior Frontend. Suma {c.years} años de experiencia
              construyendo productos digitales a escala, con dominio sólido de React, TypeScript y arquitectura frontend moderna.
              Combina rigor técnico con visión de producto y experiencia liderando squads multidisciplinares.
            </p>
          </Block>

          <div className="grid gap-4 sm:grid-cols-2">
            <Block icon={Award} title="Fortalezas" tone="success">
              <ul className="space-y-2 text-sm">
                {["Arquitectura frontend a escala", "Mentoría técnica de equipos", "Sensibilidad UX y accesibilidad", "Comunicación clara"].map((f) => (
                  <li key={f} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />{f}</li>
                ))}
              </ul>
            </Block>
            <Block icon={ShieldAlert} title="Riesgos detectados" tone="warning">
              <ul className="space-y-2 text-sm">
                {["Experiencia limitada con GraphQL Federation", "Últimos 2 roles con duración < 18 meses", "Sin experiencia previa en retail"].map((r) => (
                  <li key={r} className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />{r}</li>
                ))}
              </ul>
            </Block>
          </div>

          <Block icon={Cpu} title="Competencias detectadas">
            <div className="space-y-2.5">
              {[
                ["React", 96],
                ["TypeScript", 94],
                ["Arquitectura Frontend", 90],
                ["GraphQL", 78],
                ["AWS", 72],
                ["Liderazgo técnico", 88],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{k}</span>
                    <span className="font-semibold text-primary">{v}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block icon={Target} title="Coincidencia por criterios">
            <ul className="space-y-3">
              {criteria.map((k) => (
                <li key={k.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{k.label}</span>
                    <span className="font-semibold">{k.val}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${k.val}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={MessageSquareQuote} title="Preguntas sugeridas (STAR)">
            <ol className="space-y-2 text-sm">
              {[
                "Cuéntame un proyecto frontend complejo en el que hayas participado.",
                "¿Cómo decidiste la arquitectura de ese sistema y por qué?",
                "¿Qué hiciste para mejorar la accesibilidad o el rendimiento?",
                "¿Qué impacto tuvo tu trabajo en el negocio? Cuantifícalo.",
              ].map((q, i) => (
                <li key={q} className="rounded-xl border border-border/60 bg-surface/40 p-3">
                  <span className="mr-2 font-semibold text-primary">{i + 1}.</span>{q}
                </li>
              ))}
            </ol>
          </Block>

          <Block icon={Star} title="Recomendación final" tone="primary">
            <p className="text-sm">
              <span className="font-semibold text-success">Recomendado para pasar a entrevista técnica.</span>{" "}
              Perfil top del pipeline con {c.score}% de compatibilidad. Se sugiere iniciar contacto en 24h y agendar una entrevista con el
              Staff Engineer de la squad.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl gradient-primary px-3.5 py-2 text-xs font-semibold text-white shadow-glow">
                Avanzar a entrevista <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button className="rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                Guardar en shortlist
              </button>
              <button className="rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                Descartar
              </button>
            </div>
          </Block>
        </div>
      </aside>
    </div>
  );
}

function Block({
  icon: Icon,
  title,
  tone = "default",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone?: "default" | "success" | "warning" | "primary";
  children: React.ReactNode;
}) {
  const toneCls =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "primary" ? "text-primary" : "text-primary";
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
      <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${toneCls}`}>
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

function CompareModal({ candidates, onClose }: { candidates: Candidate[]; onClose: () => void }) {
  const rows: { label: string; icon: React.ComponentType<{ className?: string }>; get: (c: Candidate) => React.ReactNode }[] = [
    { label: "Compatibilidad", icon: BarChart3, get: (c) => <span className="font-semibold text-success">{c.score}%</span> },
    { label: "Rol actual", icon: Briefcase, get: (c) => c.role },
    { label: "Ubicación", icon: MapPin, get: (c) => c.location },
    { label: "Experiencia", icon: Layers, get: (c) => `${c.years} años` },
    { label: "Ajuste cultural", icon: Heart, get: () => <span className="font-semibold text-primary">92%</span> },
    { label: "Riesgo", icon: ShieldAlert, get: (c) => (c.score >= 90 ? "Bajo" : c.score >= 80 ? "Medio" : "Alto") },
    { label: "Competencias clave", icon: Cpu, get: (c) => (
        <div className="flex flex-wrap gap-1">
          {c.skills.slice(0, 3).map((s) => <span key={s} className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium">{s}</span>)}
        </div>
      )
    },
    { label: "Recomendación", icon: Star, get: (c) => (c.score >= 90 ? "A+" : c.score >= 80 ? "A" : "B") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-border/60 bg-background shadow-glow animate-float-up">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 p-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <h3 className="truncate text-base font-semibold">Comparar Candidatos</h3>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Matriz de decisión ponderada — {candidates.length} candidatos seleccionados</p>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="sticky top-0 bg-background/95 backdrop-blur">
              <tr className="border-b border-border/60">
                <th className="w-56 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Criterio
                </th>
                {candidates.map((c) => {
                  const initials = c.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
                  return (
                    <th key={c.id} className="px-4 py-3 text-left">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-primary text-[11px] font-semibold text-white">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold">{c.name}</div>
                          <div className="truncate text-[10px] text-muted-foreground">{c.role}</div>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-border/40 hover:bg-surface/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <r.icon className="h-3.5 w-3.5 text-primary" /> {r.label}
                    </div>
                  </td>
                  {candidates.map((c) => (
                    <td key={c.id} className="px-4 py-3 align-top text-sm">
                      {r.get(c)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-primary/5">
                <td className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Veredicto IA</td>
                {candidates.map((c) => (
                  <td key={c.id} className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                      c.score >= 90 ? "bg-success/15 text-success" : c.score >= 80 ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning"
                    }`}>
                      <Star className="h-3 w-3" /> {c.score >= 90 ? "Top pick" : c.score >= 80 ? "Fuerte candidato" : "A considerar"}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 p-4">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Users2 className="h-3.5 w-3.5" /> Basado en criterios ponderados por RecruitAI
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
              <Download className="mr-1.5 inline h-3.5 w-3.5" /> Exportar comparativa
            </button>
            <button className="rounded-xl gradient-primary px-3.5 py-2 text-xs font-semibold text-white shadow-glow">
              Elegir finalista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

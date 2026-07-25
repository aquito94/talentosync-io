import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  MessageSquare,
  Wand2,
  FileText,
  Users,
  Mail,
  BarChart3,
  ThumbsUp,
  Copy,
  Save,
  Download,
  FolderPlus,
  Paperclip,
  Mic,
  Search,
  MoreHorizontal,
  Building2,
  MapPin,
  Layers,
  Clock,
  CalendarClock,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  User2,
  Pin,
  Archive,
} from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recruit-copilot")({
  head: () => ({
    meta: [
      { title: "Copiloto IA para Reclutadores — RecruitAI OS" },
      { name: "description", content: "Tu asistente de IA para reclutamiento: crea vacantes, analiza candidatos, redacta correos y genera reportes ejecutivos." },
      { property: "og:title", content: "Copiloto IA para Reclutadores — RecruitAI OS" },
      { property: "og:description", content: "Tu asistente de IA para reclutamiento: crea vacantes, analiza candidatos, redacta correos y genera reportes ejecutivos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CopilotPage,
});

type Msg =
  | { from: "user"; text: string }
  | { from: "ai"; kind?: "text" | "shortlist" | "email" | "typing"; text?: string };

const history = [
  {
    process: "Ingeniero Senior Frontend · Nova Retail",
    chats: [
      { title: "Shortlist top 5 candidatos", when: "hace 2 min", active: true },
      { title: "Redactar outreach a Elena Ruiz", when: "hace 1 h" },
      { title: "Comparar Elena vs David", when: "ayer" },
    ],
  },
  {
    process: "Product Designer · Fintrail",
    chats: [
      { title: "Reescribir la vacante en tono inclusivo", when: "hace 3 h" },
      { title: "Preguntas STAR para diseño de producto", when: "ayer" },
    ],
  },
  {
    process: "Data Scientist · Aurora Labs",
    chats: [
      { title: "Reporte ejecutivo del pipeline", when: "hace 2 días" },
      { title: "Recomendación final de contratación", when: "hace 3 días" },
    ],
  },
];

const quickActions = [
  { icon: FileText, title: "Crear Vacante", desc: "Redacta una descripción de cargo lista para publicar." },
  { icon: Users, title: "Analizar Candidatos", desc: "Compara CVs contra la vacante activa." },
  { icon: Wand2, title: "Generar Preguntas STAR", desc: "Preguntas de entrevista por competencia." },
  { icon: Mail, title: "Redactar Correo", desc: "Outreach, seguimiento o rechazo profesional." },
  { icon: BarChart3, title: "Crear Reporte Ejecutivo", desc: "Estado del pipeline para dirección." },
  { icon: ThumbsUp, title: "Recomendar Contratación", desc: "Veredicto ponderado por criterios." },
];

function CopilotPage() {
  const [input, setInput] = useState("");
  const [messages] = useState<Msg[]>([
    {
      from: "user",
      text: "Dame un shortlist de los 5 mejores candidatos para el rol de Ingeniero Senior Frontend en Madrid y redacta el primer correo de contacto.",
    },
    { from: "ai", kind: "shortlist" },
    { from: "user", text: "Perfecto. Envíalo por Correos Inteligentes y agenda entrevistas si responden en 24h." },
    { from: "ai", kind: "email" },
    { from: "ai", kind: "typing" },
  ]);

  return (
    <AppShell>
      <div className="grid h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
        {/* LEFT: History */}
        <aside className="hidden flex-col border-r border-border/60 bg-sidebar/40 lg:flex">
          <div className="p-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-2.5 text-sm font-semibold text-white shadow-glow">
              <Plus className="h-4 w-4" /> Nuevo chat
            </button>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-xs text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              <input placeholder="Buscar en el historial…" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-6">
            <div className="mt-2 flex items-center justify-between px-2 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Fijados</span>
              <Pin className="h-3 w-3 text-muted-foreground" />
            </div>
            <button className="flex w-full items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-left text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="truncate font-medium">Playbook Q4 · Contratación técnica</span>
            </button>

            {history.map((group) => (
              <div key={group.process} className="mt-6">
                <div className="flex items-center gap-2 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Briefcase className="h-3 w-3 text-primary" />
                  <span className="truncate">{group.process}</span>
                </div>
                <ul className="space-y-1">
                  {group.chats.map((c, i) => (
                    <li key={i}>
                      <button
                        className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          c.active
                            ? "bg-primary/10 text-foreground"
                            : "text-muted-foreground hover:bg-surface/40 hover:text-foreground"
                        }`}
                      >
                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{c.title}</span>
                          <span className="text-[10px] text-muted-foreground">{c.when}</span>
                        </span>
                        <MoreHorizontal className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <button className="mt-6 flex w-full items-center gap-2 rounded-xl border border-border-strong bg-surface/40 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
              <Archive className="h-3.5 w-3.5" /> Ver conversaciones archivadas
            </button>
          </div>
        </aside>

        {/* CENTER: Chat */}
        <section className="flex min-w-0 flex-col">
          {/* Chat header */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-6 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary shadow-glow">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">RecruitAI Copilot</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  Enterprise · Especializado en reclutamiento
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-[11px] font-semibold text-success sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" /> En línea
              </span>
              <button className="rounded-xl border border-border-strong bg-surface/60 p-2 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-8">
              {/* Welcome */}
              <WelcomeCard />

              {/* Quick actions */}
              <div>
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Acciones rápidas
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((a, i) => (
                    <button
                      key={a.title}
                      className="group glass-panel flex items-start gap-3 rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:shadow-glow animate-float-up"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-white">
                        <a.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{a.title}</span>
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">{a.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation */}
              <div className="space-y-6">
                {messages.map((m, i) => {
                  if (m.from === "user") return <UserBubble key={i} text={m.text} />;
                  if (m.kind === "typing") return <TypingBubble key={i} />;
                  if (m.kind === "shortlist") return <ShortlistBubble key={i} />;
                  if (m.kind === "email") return <EmailBubble key={i} />;
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-border/60 bg-background/70 px-6 py-4 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {["Redactar seguimiento", "Traducir vacante al inglés", "Resumen del pipeline", "Preguntas de cultura"].map((s) => (
                  <button key={s} className="rounded-full border border-border-strong bg-surface/60 px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground">
                    {s}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 rounded-2xl border border-border-strong bg-surface/60 p-2 transition focus-within:border-primary/60 focus-within:shadow-glow">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                  <div className="flex items-center gap-1 pl-1">
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground">
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder="Pregúntale al Copiloto sobre vacantes, candidatos, entrevistas o reportes…"
                    className="min-h-[40px] w-full resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary text-white shadow-glow">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Modelo: RecruitAI GPT-Enterprise · Contexto: Ingeniero Senior Frontend</span>
                <span>Presiona <kbd className="rounded border border-border bg-surface/60 px-1">⌘</kbd>+<kbd className="rounded border border-border bg-surface/60 px-1">↵</kbd> para enviar</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Context */}
        <aside className="hidden overflow-y-auto border-l border-border/60 bg-sidebar/40 p-5 lg:block">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Contexto del Proceso
          </div>
          <h3 className="mt-2 text-base font-semibold tracking-tight">Ingeniero Senior Frontend</h3>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" /> Proceso activo · Prioridad alta
          </div>

          <div className="mt-5 space-y-4">
            <ContextRow icon={Briefcase} label="Vacante" value="Ingeniero Senior Frontend" />
            <ContextRow icon={Building2} label="Empresa" value="Nova Retail Group" />
            <ContextRow icon={MapPin} label="Ubicación" value="Madrid · Híbrido" />
            <ContextRow icon={Layers} label="Etapa" value="Screening & Entrevistas" />
          </div>

          <div className="mt-5 rounded-2xl border border-border/60 bg-surface/40 p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <Stat label="Candidatos" value="12" tone="text-foreground" />
              <Stat label="Alta compat." value="7" tone="text-success" />
              <Stat label="Entrevistas" value="4" tone="text-primary" />
              <Stat label="En oferta" value="1" tone="text-warning" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border/60 bg-surface/40 p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Clock className="h-3 w-3 text-primary" /> Tiempo promedio
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-semibold">24 días</span>
              <span className="pb-1 text-[11px] text-success">-12% vs Q3</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
              <div className="h-full w-[68%] rounded-full gradient-primary" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Benchmark del sector: 34 días</p>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <CalendarClock className="h-3 w-3 text-primary" /> Próximas entrevistas
              </div>
              <button className="text-[10px] font-semibold text-primary">Ver todas</button>
            </div>
            <ul className="space-y-2">
              {[
                { name: "Elena Ruiz Martín", when: "Hoy · 16:30", type: "Técnica", initials: "ER" },
                { name: "David Chen", when: "Mañana · 10:00", type: "Cultura", initials: "DC" },
                { name: "Aisha Khan", when: "Jueves · 12:00", type: "Producto", initials: "AK" },
              ].map((e) => (
                <li key={e.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-surface/40 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-primary text-[11px] font-semibold text-white">
                    {e.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{e.name}</span>
                    <span className="block text-[11px] text-muted-foreground">{e.when} · {e.type}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function WelcomeCard() {
  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl p-6 animate-float-up">
      <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-hero)" }} />
      <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-primary shadow-glow">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Hola Álvaro. Soy <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RecruitAI Copilot</span>.
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            Estoy listo para ayudarte durante todo el proceso de reclutamiento.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" /> Cifrado empresarial</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" /> Datos aislados por proceso</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" /> Conforme al RGPD</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end gap-3">
      <div className="grid max-w-[80%] gap-1">
        <div className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-glow">
          {text}
        </div>
        <span className="pr-1 text-right text-[10px] text-muted-foreground">Álvaro · ahora</span>
      </div>
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-surface-elevated text-xs font-semibold">
        <User2 className="h-4 w-4" />
      </div>
    </div>
  );
}

function AiBubble({ children, actions = true }: { children: React.ReactNode; actions?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl gradient-primary text-white shadow-glow">
        <Bot className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">RecruitAI Copilot</span>
          <span>· ahora</span>
        </div>
        <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
        {actions && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <ActionChip icon={Copy} label="Copiar" />
            <ActionChip icon={Save} label="Guardar" />
            <ActionChip icon={Download} label="Exportar PDF" />
            <ActionChip icon={Send} label="Enviar" />
            <ActionChip icon={FolderPlus} label="Agregar al expediente" />
          </div>
        )}
      </div>
    </div>
  );
}

function ActionChip({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground">
      <Icon className="h-3 w-3" /> {label}
    </button>
  );
}

function ShortlistBubble() {
  const list = [
    { name: "Elena Ruiz Martín", score: 96 },
    { name: "David Chen", score: 92 },
    { name: "Aisha Khan", score: 89 },
    { name: "Mateo Silva", score: 84 },
    { name: "Nina Larsson", score: 78 },
  ];
  return (
    <AiBubble>
      <p>Estos son los 5 candidatos con mayor compatibilidad para el rol:</p>
      <ul className="mt-3 space-y-2">
        {list.map((c) => (
          <li key={c.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl border border-border/60 bg-surface/40 px-3 py-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg gradient-primary text-[10px] font-semibold text-white">
              {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
            <span className="min-w-0 truncate text-sm font-medium">{c.name}</span>
            <span className="rounded-md bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">{c.score}%</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </li>
        ))}
      </ul>
      <p className="mt-3">Puedo redactar el primer correo de contacto para los 5. ¿Prefieres un tono cercano o corporativo?</p>
    </AiBubble>
  );
}

function EmailBubble() {
  return (
    <AiBubble>
      <p>Perfecto, aquí tienes el borrador base para el primer contacto:</p>
      <div className="mt-3 overflow-hidden rounded-2xl border border-border/60 bg-surface/40">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/50 bg-background/40 px-4 py-2.5 text-[11px] text-muted-foreground">
          <Mail className="h-3.5 w-3.5 text-primary" />
          <div className="min-w-0 truncate">
            <span className="font-semibold text-foreground">Asunto: </span>
            Conversemos sobre un rol Senior Frontend en Nova Retail Group
          </div>
          <span className="rounded-md bg-primary/15 px-2 py-0.5 font-semibold text-primary">Borrador IA</span>
        </div>
        <div className="space-y-2 p-4 text-sm">
          <p>Hola Elena,</p>
          <p>He revisado tu trayectoria y me ha llamado mucho la atención tu experiencia liderando la arquitectura frontend de productos con millones de usuarios. Estamos buscando una <strong>Ingeniera Senior Frontend</strong> para nuestra plataforma de e-commerce en Madrid (modalidad híbrida) y creo que podría ser una gran conversación.</p>
          <p>¿Tienes 20 minutos esta semana para conocernos sin compromiso?</p>
          <p className="text-muted-foreground">— Álvaro, RecruitAI</p>
        </div>
      </div>
    </AiBubble>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl gradient-primary text-white shadow-glow">
        <Bot className="h-4 w-4" />
      </div>
      <div className="glass-panel inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-xs text-muted-foreground">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="h-2 w-2 rounded-full bg-primary/70 animate-pulse-glow" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 rounded-full bg-primary/40 animate-pulse-glow" style={{ animationDelay: "300ms" }} />
        </span>
        RecruitAI Copilot está pensando…
      </div>
    </div>
  );
}

function ContextRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
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

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-2.5">
      <div className={`text-lg font-semibold ${tone}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

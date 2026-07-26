import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Briefcase,
  Brain,
  Clock,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Video,
} from "lucide-react";

const kpis = [
  { label: "Candidatos activos", value: "1.248", delta: "+12,4%", up: true, icon: Users },
  { label: "Vacantes abiertas", value: "24", delta: "+3", up: true, icon: Briefcase },
  { label: "Evaluaciones IA / día", value: "3.412", delta: "+28,9%", up: true, icon: Brain },
  { label: "Tiempo de contratación", value: "11,2d", delta: "-18%", up: true, icon: Clock },
];

const pipeline = [
  { m: "Ene", aplicaron: 240, evaluados: 180, contratados: 22 },
  { m: "Feb", aplicaron: 310, evaluados: 220, contratados: 30 },
  { m: "Mar", aplicaron: 420, evaluados: 330, contratados: 41 },
  { m: "Abr", aplicaron: 380, evaluados: 300, contratados: 38 },
  { m: "May", aplicaron: 520, evaluados: 410, contratados: 52 },
  { m: "Jun", aplicaron: 610, evaluados: 480, contratados: 61 },
  { m: "Jul", aplicaron: 720, evaluados: 560, contratados: 74 },
];

const sources = [
  { name: "LinkedIn", value: 42, color: "var(--color-chart-1)" },
  { name: "Referidos", value: 24, color: "var(--color-chart-3)" },
  { name: "Web propia", value: 18, color: "var(--color-chart-2)" },
  { name: "Otros", value: 16, color: "var(--color-chart-4)" },
];

const funnel = [
  { stage: "Aplicaron", value: 4200 },
  { stage: "Evaluación IA", value: 2860 },
  { stage: "Entrevista", value: 940 },
  { stage: "Oferta", value: 210 },
  { stage: "Contratados", value: 148 },
];

const candidates = [
  { name: "Laura Fernández", role: "Diseñadora de Producto Senior", score: 96, stage: "Entrevista final", tag: "Mejor coincidencia" },
  { name: "Marco Ríos", role: "Ingeniero Backend · Go", score: 92, stage: "Prueba técnica", tag: "Alto potencial" },
  { name: "Priya Nair", role: "Científica de Datos", score: 89, stage: "Entrevista con IA", tag: "Nuevo" },
  { name: "Julián Costa", role: "Líder de Marketing de Crecimiento", score: 87, stage: "Evaluación", tag: "Referido" },
  { name: "Sofía Álvarez", role: "Directora de Personas", score: 84, stage: "Entrevista final", tag: "Ejecutivo" },
];

const activity = [
  { icon: Brain, text: "La IA descartó 128 CVs no calificados para Backend Senior", time: "hace 2 min", color: "text-chart-1" },
  { icon: Video, text: "Entrevista automatizada completada por Priya Nair", time: "hace 14 min", color: "text-chart-3" },
  { icon: MessageSquare, text: "El copiloto envió 42 mensajes de contacto personalizados", time: "hace 38 min", color: "text-chart-2" },
  { icon: CheckCircle2, text: "Oferta aceptada por Laura Fernández (Diseño de Producto)", time: "hace 1 h", color: "text-success" },
];

function TooltipBox({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <div className="font-medium text-foreground">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="mt-1 flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.dataKey}</span>
          <span className="ml-auto font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 space-y-8">
      {/* Hero */}
      <section
        className="glass-panel relative overflow-hidden rounded-2xl p-8 animate-float-up"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-background/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Copiloto IA activo · 4 flujos en ejecución
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
              Bienvenida nuevamente, Genesis.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Tu asistente inteligente para acelerar y optimizar cada proceso de reclutamiento.
            </p>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg animate-float-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight">{k.value}</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-border-strong bg-surface-elevated text-primary">
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className={`relative mt-3 inline-flex items-center gap-1 text-xs font-medium ${k.up ? "text-success" : "text-destructive"}`}>
              {k.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {k.delta}
              <span className="text-muted-foreground font-normal">vs. semana anterior</span>
            </div>
          </div>
        ))}
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Pipeline area chart */}
        <div className="xl:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Flujo de contratación</h3>
              <p className="text-xs text-muted-foreground">Aplicaciones vs. evaluaciones IA vs. contrataciones</p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              {["7D", "30D", "90D", "1A"].map((t, i) => (
                <button
                  key={t}
                  className={`rounded-md px-2.5 py-1 transition ${
                    i === 2 ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pipeline} margin={{ left: -20, right: 8, top: 10 }}>
                <defs>
                  <linearGradient id="gApplied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gScreened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gHired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<TooltipBox />} cursor={{ stroke: "var(--color-border-strong)" }} />
                <Area type="monotone" dataKey="aplicaron" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#gApplied)" />
                <Area type="monotone" dataKey="evaluados" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#gScreened)" />
                <Area type="monotone" dataKey="contratados" stroke="var(--color-chart-3)" strokeWidth={2} fill="url(#gHired)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sources donut */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Fuentes de talento</h3>
          <p className="text-xs text-muted-foreground">Distribución últimos 30 días</p>
          <div className="mt-2 flex items-center">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sources}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {sources.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<TooltipBox />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-2">
              {sources.map((s) => (
                <li key={s.name} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="ml-auto font-medium">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Funnel + Activity */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Embudo de conversión IA</h3>
              <p className="text-xs text-muted-foreground">De aplicación a contratación</p>
            </div>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              Tasa 3,52%
            </span>
          </div>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} margin={{ left: -10, right: 8 }}>
                <defs>
                  <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" />
                    <stop offset="100%" stopColor="var(--color-chart-2)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="stage" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<TooltipBox />} cursor={{ fill: "var(--color-muted)" }} />
                <Bar dataKey="value" fill="url(#gBar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Actividad del Copiloto</h3>
            <span className="text-[11px] text-muted-foreground">En vivo</span>
          </div>
          <ul className="mt-4 space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="flex gap-3 animate-float-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border-strong bg-surface-elevated ${a.color}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-foreground/90">{a.text}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Candidates table */}
      <section className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-base font-semibold">Mejores candidatos evaluados por IA</h3>
            <p className="text-xs text-muted-foreground">Ranking automático basado en ajuste + habilidades + intención</p>
          </div>
          <button className="text-xs font-medium text-primary hover:underline">Ver todos →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Candidato</th>
                <th className="px-5 py-3 font-medium">Etapa</th>
                <th className="px-5 py-3 font-medium">Puntaje IA</th>
                <th className="px-5 py-3 font-medium">Etiqueta</th>
                <th className="px-5 py-3 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, i) => (
                <tr
                  key={c.name}
                  className="border-t border-border transition-colors hover:bg-surface/60"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary/70 to-chart-2 text-xs font-semibold text-white">
                        {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{c.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{c.stage}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                        <div className="h-full gradient-primary" style={{ width: `${c.score}%` }} />
                      </div>
                      <span className="w-8 text-xs font-semibold">{c.score}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      {c.tag}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="rounded-md border border-border-strong bg-surface px-3 py-1.5 text-xs font-medium transition hover:bg-surface-elevated">
                      Ver perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

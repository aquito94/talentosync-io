import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { ArrowUpRight, Calendar, Download, Filter } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — RecruitAI OS" },
      { name: "description", content: "Pipeline velocity, sourcing ROI and DEI insights — every hiring signal in one board." },
      { property: "og:title", content: "Analytics — RecruitAI OS" },
      { property: "og:description", content: "Pipeline velocity, sourcing ROI and DEI insights — every hiring signal in one board." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

const funnel = [
  { stage: "Applied", value: 2140 },
  { stage: "Screened", value: 1420 },
  { stage: "Interview", value: 620 },
  { stage: "Offer", value: 148 },
  { stage: "Hired", value: 92 },
];

const trend = Array.from({ length: 30 }).map((_, i) => ({
  d: i + 1,
  hires: 20 + Math.round(Math.sin(i / 3) * 8 + i * 0.6),
  apps: 80 + Math.round(Math.cos(i / 4) * 20 + i * 1.5),
}));

const sources = [
  { name: "LinkedIn", value: 42 },
  { name: "Referrals", value: 26 },
  { name: "Job boards", value: 18 },
  { name: "AI Sourcing", value: 14 },
];
const colors = ["oklch(0.55 0.22 264)", "oklch(0.58 0.24 295)", "oklch(0.65 0.2 275)", "oklch(0.72 0.16 270)"];

const kpis = [
  { label: "Time to hire", value: "11.2d", delta: "-18%" },
  { label: "Cost per hire", value: "€2,140", delta: "-9%" },
  { label: "Offer acceptance", value: "87%", delta: "+4%" },
  { label: "Pipeline velocity", value: "1.42x", delta: "+22%" },
];

function AnalyticsPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1500px] px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-float-up">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enterprise pipeline · last 30 days</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-sm">
              <Calendar className="mr-2 inline h-4 w-4" /> Last 30 days
            </button>
            <button className="rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-sm">
              <Filter className="mr-2 inline h-4 w-4" /> All teams
            </button>
            <button className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow">
              <Download className="mr-2 inline h-4 w-4" /> Export
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <div key={k.label} className="glass-panel rounded-2xl p-5 animate-float-up" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k.label}</div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                  <ArrowUpRight className="h-3 w-3" /> {k.delta}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Trend */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2 animate-float-up">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Hiring trend</h3>
                <p className="text-xs text-muted-foreground">Applications vs. hires</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.55 0.22 264)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.58 0.24 295)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.58 0.24 295)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                  <XAxis dataKey="d" stroke="oklch(0.68 0.02 260)" fontSize={11} />
                  <YAxis stroke="oklch(0.68 0.02 260)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "oklch(0.17 0.025 265)", border: "1px solid oklch(0.32 0.04 268)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="apps" stroke="oklch(0.55 0.22 264)" strokeWidth={2} fill="url(#g1)" />
                  <Area type="monotone" dataKey="hires" stroke="oklch(0.58 0.24 295)" strokeWidth={2} fill="url(#g2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sources */}
          <div className="glass-panel rounded-2xl p-6 animate-float-up" style={{ animationDelay: "80ms" }}>
            <h3 className="text-sm font-semibold">Source mix</h3>
            <p className="text-xs text-muted-foreground">Where hires come from</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sources} innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3} stroke="none">
                    {sources.map((_, i) => (
                      <Cell key={i} fill={colors[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "oklch(0.17 0.025 265)", border: "1px solid oklch(0.32 0.04 268)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {sources.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i] }} />
                  <span className="flex-1">{s.name}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel */}
        <div className="mt-6 glass-panel rounded-2xl p-6 animate-float-up">
          <h3 className="text-sm font-semibold">Conversion funnel</h3>
          <p className="text-xs text-muted-foreground">Stage-to-stage flow</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical">
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.68 0.02 260)" fontSize={11} />
                <YAxis type="category" dataKey="stage" stroke="oklch(0.68 0.02 260)" fontSize={11} width={90} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.025 265)", border: "1px solid oklch(0.32 0.04 268)", borderRadius: 12 }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {funnel.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Bar>
                <Legend wrapperStyle={{ fontSize: 11, color: "oklch(0.68 0.02 260)" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

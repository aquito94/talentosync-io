import { useState } from "react";
import {
  FileText,
  Sparkles,
  Wand2,
  Copy,
  Download,
  RefreshCw,
  Globe2,
  Building2,
  MapPin,
  Briefcase,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/job-generator")({
  head: () => ({
    meta: [
      { title: "AI Job Generator — RecruitAI OS" },
      { name: "description", content: "Generate structured, inclusive job descriptions in seconds with role-aware AI templates." },
      { property: "og:title", content: "AI Job Generator — RecruitAI OS" },
      { property: "og:description", content: "Generate structured, inclusive job descriptions in seconds with role-aware AI templates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobGeneratorPage,
});

const templates = [
  { title: "Senior Software Engineer", team: "Engineering", uses: 128 },
  { title: "Product Designer", team: "Design", uses: 84 },
  { title: "Growth Marketing Lead", team: "Marketing", uses: 62 },
  { title: "Data Scientist", team: "Data", uses: 47 },
];

function JobGeneratorPage() {
  const [role, setRole] = useState("Senior Full-Stack Engineer");
  const [seniority, setSeniority] = useState("Senior");
  const [location, setLocation] = useState("Remote — EU");

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-float-up">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> AI Module
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">AI Job Generator</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Craft structured, inclusive and SEO-ready job descriptions in seconds.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-border-strong bg-surface/60 px-4 py-2 text-sm font-medium hover:bg-surface">
              <Download className="mr-2 inline h-4 w-4" /> Export
            </button>
            <button className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow">
              <Wand2 className="mr-2 inline h-4 w-4" /> Generate
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* Form */}
          <aside className="glass-panel rounded-2xl p-6 animate-float-up">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Brief</h2>
            <div className="mt-5 space-y-4">
              <Field label="Role title" icon={Briefcase}>
                <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              </Field>
              <Field label="Seniority" icon={ChevronDown}>
                <select value={seniority} onChange={(e) => setSeniority(e.target.value)} className="w-full bg-transparent text-sm outline-none">
                  {["Junior", "Mid", "Senior", "Staff", "Principal"].map((s) => (
                    <option key={s} className="bg-surface">{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Location" icon={MapPin}>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-transparent text-sm outline-none" />
              </Field>
              <Field label="Company" icon={Building2}>
                <input defaultValue="RecruitAI OS" className="w-full bg-transparent text-sm outline-none" />
              </Field>
              <Field label="Language" icon={Globe2}>
                <select className="w-full bg-transparent text-sm outline-none">
                  {["English", "Español", "Deutsch", "Français"].map((s) => (
                    <option key={s} className="bg-surface">{s}</option>
                  ))}
                </select>
              </Field>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Tone</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Professional", "Friendly", "Bold", "Concise"].map((t, i) => (
                    <button key={t} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${i === 0 ? "border-primary/60 bg-primary/10 text-foreground" : "border-border-strong bg-surface/40 text-muted-foreground hover:text-foreground"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-medium text-muted-foreground">Must-have skills</label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"].map((s) => (
                    <span key={s} className="rounded-md border border-border-strong bg-surface/60 px-2 py-1 text-[11px]">{s}</span>
                  ))}
                  <button className="rounded-md border border-dashed border-border-strong px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">+ Add</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Preview */}
          <section className="glass-panel rounded-2xl p-8 animate-float-up" style={{ animationDelay: "60ms" }}>
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-mono">job-description.md</span>
                <span className="ml-2 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">Ready</span>
              </div>
              <div className="flex gap-1">
                <IconBtn icon={Copy} />
                <IconBtn icon={RefreshCw} />
              </div>
            </div>

            <article className="prose prose-invert mt-6 max-w-none text-sm leading-relaxed text-foreground/90">
              <h2 className="text-2xl font-semibold tracking-tight">
                {seniority} {role.replace("Senior ", "")}
              </h2>
              <p className="text-muted-foreground">RecruitAI OS · {location} · Full-time</p>

              <h3 className="mt-6 text-base font-semibold">About the role</h3>
              <p>
                We're looking for a <b>{seniority} {role.replace("Senior ", "")}</b> to help scale RecruitAI OS — the enterprise operating system for AI-powered recruiting used by 400+ talent teams worldwide.
              </p>

              <h3 className="mt-5 text-base font-semibold">What you'll do</h3>
              <ul className="list-disc pl-5 marker:text-primary">
                <li>Design, build and ship features across our React + TypeScript stack.</li>
                <li>Own the reliability and performance of critical customer-facing services.</li>
                <li>Partner with Product and Design to shape the AI copilot roadmap.</li>
                <li>Mentor mid-level engineers and raise the technical bar.</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold">You'll thrive if you have</h3>
              <ul className="list-disc pl-5 marker:text-primary">
                <li>5+ years of production experience with modern web stacks.</li>
                <li>Strong systems thinking and product intuition.</li>
                <li>Track record of shipping in high-growth SaaS environments.</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold">Compensation</h3>
              <p>€90k–€130k base + equity + full remote budget.</p>
            </article>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Bias check passed ·
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Inclusive language ·
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Legal review clear
            </div>
          </section>
        </div>

        {/* Templates */}
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Popular templates</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {templates.map((t, i) => (
              <div key={t.title} className="group glass-panel rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-glow animate-float-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-elevated text-primary group-hover:gradient-primary group-hover:text-white transition">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{t.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t.team} · used {t.uses}×</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border-strong bg-surface/40 px-3 py-2.5 focus-within:border-primary/60 focus-within:shadow-glow transition">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {children}
      </div>
    </div>
  );
}

function IconBtn({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button className="grid h-8 w-8 place-items-center rounded-lg border border-border-strong bg-surface/60 text-muted-foreground hover:text-foreground transition">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

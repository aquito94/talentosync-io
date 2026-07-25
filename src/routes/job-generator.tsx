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
      { title: "Generador Inteligente de Vacantes — RecruitAI OS" },
      { name: "description", content: "Genera descripciones de vacantes estructuradas e inclusivas en segundos con plantillas de IA por rol." },
      { property: "og:title", content: "Generador Inteligente de Vacantes — RecruitAI OS" },
      { property: "og:description", content: "Genera descripciones de vacantes estructuradas e inclusivas en segundos con plantillas de IA por rol." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobGeneratorPage,
});

const templates = [
  { title: "Ingeniero de Software Senior", team: "Ingeniería", uses: 128 },
  { title: "Diseñador de Producto", team: "Diseño", uses: 84 },
  { title: "Líder de Marketing de Crecimiento", team: "Marketing", uses: 62 },
  { title: "Científico de Datos", team: "Datos", uses: 47 },
];

function JobGeneratorPage() {
  const [role, setRole] = useState("Ingeniero Full-Stack Senior");
  const [seniority, setSeniority] = useState("Senior");
  const [location, setLocation] = useState("Remoto — UE");

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-float-up">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> Módulo IA
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Generador Inteligente de Vacantes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Crea descripciones de vacantes estructuradas, inclusivas y listas para SEO en segundos.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-border-strong bg-surface/60 px-4 py-2 text-sm font-medium hover:bg-surface">
              <Download className="mr-2 inline h-4 w-4" /> Exportar
            </button>
            <button className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow">
              <Wand2 className="mr-2 inline h-4 w-4" /> Generar
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* Form */}
          <aside className="glass-panel rounded-2xl p-6 animate-float-up">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Resumen</h2>
            <div className="mt-5 space-y-4">
              <Field label="Título del puesto" icon={Briefcase}>
                <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              </Field>
              <Field label="Seniority" icon={ChevronDown}>
                <select value={seniority} onChange={(e) => setSeniority(e.target.value)} className="w-full bg-transparent text-sm outline-none">
                  {["Junior", "Semi Senior", "Senior", "Staff", "Principal"].map((s) => (
                    <option key={s} className="bg-surface">{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Ubicación" icon={MapPin}>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-transparent text-sm outline-none" />
              </Field>
              <Field label="Empresa" icon={Building2}>
                <input defaultValue="RecruitAI OS" className="w-full bg-transparent text-sm outline-none" />
              </Field>
              <Field label="Idioma" icon={Globe2}>
                <select className="w-full bg-transparent text-sm outline-none">
                  {["Español", "English", "Deutsch", "Français"].map((s) => (
                    <option key={s} className="bg-surface">{s}</option>
                  ))}
                </select>
              </Field>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Tono</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Profesional", "Cercano", "Audaz", "Conciso"].map((t, i) => (
                    <button key={t} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${i === 0 ? "border-primary/60 bg-primary/10 text-foreground" : "border-border-strong bg-surface/40 text-muted-foreground hover:text-foreground"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-medium text-muted-foreground">Habilidades imprescindibles</label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"].map((s) => (
                    <span key={s} className="rounded-md border border-border-strong bg-surface/60 px-2 py-1 text-[11px]">{s}</span>
                  ))}
                  <button className="rounded-md border border-dashed border-border-strong px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">+ Añadir</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Preview */}
          <section className="glass-panel rounded-2xl p-8 animate-float-up" style={{ animationDelay: "60ms" }}>
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-mono">descripcion-vacante.md</span>
                <span className="ml-2 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">Listo</span>
              </div>
              <div className="flex gap-1">
                <IconBtn icon={Copy} />
                <IconBtn icon={RefreshCw} />
              </div>
            </div>

            <article className="prose prose-invert mt-6 max-w-none text-sm leading-relaxed text-foreground/90">
              <h2 className="text-2xl font-semibold tracking-tight">
                {role}
              </h2>
              <p className="text-muted-foreground">RecruitAI OS · {location} · Jornada completa</p>

              <h3 className="mt-6 text-base font-semibold">Sobre el rol</h3>
              <p>
                Buscamos un/a <b>{role}</b> para ayudar a escalar RecruitAI OS — el sistema operativo empresarial de reclutamiento con IA utilizado por más de 400 equipos de talento en todo el mundo.
              </p>

              <h3 className="mt-5 text-base font-semibold">Qué harás</h3>
              <ul className="list-disc pl-5 marker:text-primary">
                <li>Diseñar, construir y publicar funcionalidades en nuestro stack React + TypeScript.</li>
                <li>Ser responsable de la fiabilidad y el rendimiento de servicios críticos de cara al cliente.</li>
                <li>Colaborar con Producto y Diseño para dar forma al roadmap del Copiloto IA.</li>
                <li>Mentorizar a personas del equipo y elevar el estándar técnico.</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold">Encajarás si tienes</h3>
              <ul className="list-disc pl-5 marker:text-primary">
                <li>Más de 5 años de experiencia en producción con stacks web modernos.</li>
                <li>Pensamiento sistémico e intuición de producto.</li>
                <li>Historial demostrado en entornos SaaS de alto crecimiento.</li>
              </ul>

              <h3 className="mt-5 text-base font-semibold">Compensación</h3>
              <p>90.000 € – 130.000 € base + equity + presupuesto completo para trabajo remoto.</p>
            </article>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Revisión de sesgos aprobada ·
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Lenguaje inclusivo ·
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Revisión legal en regla
            </div>
          </section>
        </div>

        {/* Templates */}
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Plantillas populares</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {templates.map((t, i) => (
              <div key={t.title} className="group glass-panel rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-glow animate-float-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-elevated text-primary group-hover:gradient-primary group-hover:text-white transition">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{t.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t.team} · usada {t.uses}×</p>
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

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import {
  Sparkles,
  Wand2,
  Copy,
  Download,
  Save,
  Send,
  Building2,
  MapPin,
  Briefcase,
  CheckCircle2,
  Target,
  Users,
  Award,
  Gift,
  Gauge,
  MessageSquareQuote,
  Search,
  FileText,
  FileType2,
  Layers,
  DollarSign,
  Zap,
  ListChecks,
  Accessibility,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/job-generator")({
  head: () => ({
    meta: [
      { title: "Generador Inteligente de Vacantes — RecruitAI OS" },
      { name: "description", content: "Crea descripciones de cargo profesionales en segundos utilizando Inteligencia Artificial." },
      { property: "og:title", content: "Generador Inteligente de Vacantes — RecruitAI OS" },
      { property: "og:description", content: "Crea descripciones de cargo profesionales en segundos utilizando Inteligencia Artificial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobGeneratorPage,
});

type FieldProps = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  hint?: string;
  full?: boolean;
};

function Field({ label, icon: Icon, children, hint, full }: FieldProps) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:shadow-glow";

const suggestions = [
  { icon: Search, title: "Optimizar para ATS", desc: "Ajusta palabras clave y estructura para sistemas de tracking." },
  { icon: Wand2, title: "Mejorar redacción", desc: "Tono profesional, claro y atractivo para el candidato ideal." },
  { icon: Gauge, title: "Agregar KPIs", desc: "Sugiere métricas medibles de éxito para el cargo." },
  { icon: Award, title: "Incluir competencias", desc: "Añade skills técnicas y blandas relevantes al rol." },
  { icon: MessageSquareQuote, title: "Generar preguntas STAR", desc: "Preguntas de entrevista por comportamiento listas para usar." },
  { icon: Accessibility, title: "Hacer lenguaje inclusivo", desc: "Reescribe para eliminar sesgos y ampliar el alcance." },
];

const tabs = [
  { id: "resumen", label: "Resumen Ejecutivo", icon: FileText },
  { id: "descripcion", label: "Descripción", icon: Layers },
  { id: "responsabilidades", label: "Responsabilidades", icon: ListChecks },
  { id: "perfil", label: "Perfil Ideal", icon: Users },
  { id: "competencias", label: "Competencias", icon: Award },
  { id: "beneficios", label: "Beneficios", icon: Gift },
  { id: "kpis", label: "KPIs", icon: Gauge },
  { id: "star", label: "Preguntas STAR", icon: MessageSquareQuote },
  { id: "ats", label: "Palabras Clave ATS", icon: Search },
] as const;

type TabId = (typeof tabs)[number]["id"];

type JobData = {
  cargo: string;
  empresa: string;
  ciudad: string;
  departamento: string;
  modalidad: string;
  tipoContratacion: string;
  nivel: string;
  salario: string;
  competencias: string;
  beneficios: string;
  objetivoCargo: string;
};

function JobGeneratorPage() {
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "GraphQL", "AWS"]);
  const [benefits, setBenefits] = useState<string[]>(["Seguro médico premium", "Trabajo remoto", "Bono anual"]);
  const [skillInput, setSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("resumen");

  const [cargo, setCargo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [departamento, setDepartamento] = useState("Tecnología");
  const [modalidad, setModalidad] = useState("Híbrido");
  const [tipoContratacion, setTipoContratacion] = useState("Indefinido");
  const [nivel, setNivel] = useState("Senior");
  const [salarioMin, setSalarioMin] = useState("");
  const [salarioMax, setSalarioMax] = useState("");
  const [objetivoCargo, setObjetivoCargo] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiError, setAiError] = useState("");
  const callGenerateJob = useServerFn(generateJobDescription);


  const addChip = (value: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) => {
    const v = value.trim();
    if (!v || list.includes(v)) return;
    setList([...list, v]);
    setInput("");
  };
  const removeChip = (value: string, list: string[], setList: (v: string[]) => void) =>
    setList(list.filter((s) => s !== value));

  const generateJob = async () => {
    setLoading(true);
    setGenerating(true);
    setAiError("");
    setAiResponse("");
    try {
      const result = await callGenerateJob({ data: { cargo, empresa, ciudad } });
      setAiResponse(result.text);
      setGenerated(true);
      setActiveTab("resumen");
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Error al generar la vacante");
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const generarVacante = generateJob;


  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1600px] px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-float-up">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3 w-3" /> Módulo IA
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Generador Inteligente de Vacantes
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              Crea descripciones de cargo profesionales en segundos utilizando Inteligencia Artificial.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
              Cargar plantilla
            </button>
            <button className="rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
              Historial
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* LEFT: form */}
          <section className="glass-panel rounded-2xl p-6 md:p-7 animate-float-up">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Configuración de la vacante</h2>
                <p className="text-xs text-muted-foreground">Completa los campos y deja que la IA redacte el resto.</p>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
                Borrador guardado hace 2 min
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Cargo" icon={Briefcase}>
                <input className={inputCls} placeholder="Ej. Ingeniero Senior Frontend" value={cargo} onChange={(e) => setCargo(e.target.value)} />
              </Field>
              <Field label="Empresa" icon={Building2}>
                <input className={inputCls} placeholder="Nombre de la empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
              </Field>
              <Field label="Ciudad" icon={MapPin}>
                <input className={inputCls} placeholder="Ej. Madrid, España" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
              </Field>
              <Field label="Departamento" icon={Users}>
                <select className={inputCls} value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
                  <option>Tecnología</option>
                  <option>Producto</option>
                  <option>Diseño</option>
                  <option>Datos e IA</option>
                  <option>Ventas</option>
                  <option>Marketing</option>
                  <option>Operaciones</option>
                </select>
              </Field>
              <Field label="Modalidad" icon={Zap}>
                <div className="grid grid-cols-3 gap-2">
                  {["Remoto", "Híbrido", "Presencial"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModalidad(m)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        modalidad === m
                          ? "border-primary/60 bg-primary/15 text-foreground shadow-glow"
                          : "border-border-strong bg-surface/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Tipo de contratación" icon={FileType2}>
                <select className={inputCls} value={tipoContratacion} onChange={(e) => setTipoContratacion(e.target.value)}>
                  <option>Indefinido</option>
                  <option>Temporal</option>
                  <option>Por proyecto</option>
                  <option>Prácticas</option>
                  <option>Freelance</option>
                </select>
              </Field>
              <Field label="Nivel" icon={Layers}>
                <div className="grid grid-cols-4 gap-2">
                  {["Junior", "Semi", "Senior", "Lead"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNivel(n)}
                      className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition ${
                        nivel === n
                          ? "border-primary/60 bg-primary/15 text-foreground shadow-glow"
                          : "border-border-strong bg-surface/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Rango salarial" icon={DollarSign} hint="Anual bruto, en la moneda local.">
                <div className="flex items-center gap-2">
                  <input className={inputCls} placeholder="Mínimo" value={salarioMin} onChange={(e) => setSalarioMin(e.target.value)} />
                  <span className="text-muted-foreground">—</span>
                  <input className={inputCls} placeholder="Máximo" value={salarioMax} onChange={(e) => setSalarioMax(e.target.value)} />
                </div>
              </Field>

              <Field label="Competencias requeridas" icon={Award} full>
                <div className="rounded-xl border border-border-strong bg-surface/60 p-2.5 focus-within:border-primary/60 focus-within:shadow-glow">
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-medium text-foreground">
                        {s}
                        <button onClick={() => removeChip(s, skills, setSkills)} className="text-muted-foreground hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addChip(skillInput, skills, setSkills, setSkillInput);
                        }
                      }}
                      placeholder="Añade una competencia y pulsa Enter…"
                      className="min-w-[180px] flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </Field>

              <Field label="Beneficios" icon={Gift} full>
                <div className="rounded-xl border border-border-strong bg-surface/60 p-2.5 focus-within:border-primary/60 focus-within:shadow-glow">
                  <div className="flex flex-wrap gap-1.5">
                    {benefits.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 rounded-lg bg-accent/15 px-2.5 py-1 text-xs font-medium text-foreground">
                        <Gift className="h-3 w-3 text-accent" />
                        {s}
                        <button onClick={() => removeChip(s, benefits, setBenefits)} className="text-muted-foreground hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addChip(benefitInput, benefits, setBenefits, setBenefitInput);
                        }
                      }}
                      placeholder="Añade un beneficio y pulsa Enter…"
                      className="min-w-[180px] flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </Field>

              <Field label="Objetivo del cargo" icon={Target} full hint="Describe brevemente la misión y el impacto esperado.">
                <textarea
                  rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder="Ej. Liderar la evolución de la plataforma de e-commerce, elevando la experiencia del usuario y la escalabilidad técnica."
                  value={objetivoCargo}
                  onChange={(e) => setObjetivoCargo(e.target.value)}
                />
              </Field>
            </div>

            {/* Generate CTA */}
            <div className="mt-8 flex flex-col gap-3 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Listo para generar · 11 campos completados
              </div>
              <button
                onClick={generarVacante}
                disabled={loading}
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl gradient-primary px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generar Vacante con IA
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>

            {(aiResponse || aiError) && (
              <div className="mt-6 rounded-2xl border border-border-strong bg-surface/60 p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Respuesta de Gemini
                </div>
                {aiError ? (
                  <p className="text-sm text-destructive">{aiError}</p>
                ) : (
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
                    {aiResponse}
                  </pre>
                )}
              </div>
            )}
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
                  <div>
                    <div className="text-sm font-semibold tracking-tight">Copiloto IA</div>
                    <div className="text-[11px] text-muted-foreground">Sugerencias contextuales en tiempo real</div>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  El copiloto analiza tu vacante mientras la editas y te propone mejoras específicas para atraer al mejor talento.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-3">
              <div className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Acciones rápidas
              </div>
              <ul className="space-y-1.5">
                {suggestions.map((s, i) => (
                  <li key={s.title}>
                    <button
                      className="group flex w-full items-start gap-3 rounded-xl border border-transparent bg-surface/40 p-3 text-left transition hover:border-primary/40 hover:bg-primary/5 animate-float-up"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-white">
                        <s.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">{s.title}</span>
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">{s.desc}</span>
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Calidad de la vacante</div>
                <span className="text-xs font-semibold text-success">Excelente</span>
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-semibold tracking-tight">92</span>
                <span className="pb-1 text-xs text-muted-foreground">/ 100</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                <div className="h-full w-[92%] rounded-full gradient-primary" />
              </div>
              <ul className="mt-4 space-y-2 text-xs">
                {[
                  ["Optimización ATS", 96],
                  ["Claridad y tono", 90],
                  ["Inclusividad", 88],
                ].map(([label, val]) => (
                  <li key={label as string} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{val}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Results */}
        <section className="mt-8">
          {!generated ? (
            <div className="glass-panel flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Aún no has generado la vacante</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Cuando la IA termine, verás aquí un panel con resumen ejecutivo, responsabilidades, KPIs, preguntas STAR y palabras clave optimizadas para ATS.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {tabs.map((t) => (
                  <span key={t.id} className="rounded-full border border-border-strong bg-surface/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel overflow-hidden rounded-2xl animate-float-up">
              {/* Result header */}
              <div className="flex flex-col gap-4 border-b border-border/60 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-glow">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Ingeniero Senior Frontend · Nova Retail Group</div>
                    <div className="text-[11px] text-muted-foreground">Generado por Copiloto IA · Madrid, España · Híbrido</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ActionBtn icon={Save} label="Guardar" />
                  <ActionBtn icon={Download} label="Exportar PDF" />
                  <ActionBtn icon={FileType2} label="Exportar Word" />
                  <ActionBtn icon={Copy} label="Copiar" />
                  <button className="inline-flex items-center gap-2 rounded-xl gradient-primary px-3.5 py-2 text-xs font-semibold text-white shadow-glow">
                    <Send className="h-3.5 w-3.5" /> Publicar
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 overflow-x-auto border-b border-border/60 px-3 py-2">
                {tabs.map((t) => {
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                        active
                          ? "bg-primary/15 text-foreground shadow-glow"
                          : "text-muted-foreground hover:bg-surface/60 hover:text-foreground"
                      }`}
                    >
                      <t.icon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="p-6 md:p-8">
                <TabContent id={activeTab} skills={skills} benefits={benefits} />
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function ActionBtn({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground">
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

function TabContent({ id, skills, benefits }: { id: TabId; skills: string[]; benefits: string[] }) {
  if (id === "resumen") {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <Section title="Resumen ejecutivo">
            <p>
              Nova Retail Group busca un <strong>Ingeniero Senior Frontend</strong> para liderar la evolución técnica de su plataforma
              de e-commerce en Madrid, bajo modalidad híbrida. El rol combina excelencia técnica, visión de producto y colaboración
              cercana con diseño y datos.
            </p>
          </Section>
          <Section title="Highlights">
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                ["Impacto", "Plataforma con +2M usuarios/mes"],
                ["Equipo", "Squad multidisciplinar de 8 personas"],
                ["Stack", "React · TypeScript · GraphQL · AWS"],
                ["Modalidad", "Híbrido · 2 días en oficina"],
              ].map(([k, v]) => (
                <li key={k} className="rounded-xl border border-border/60 bg-surface/40 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{k}</div>
                  <div className="mt-1 text-sm font-medium">{v}</div>
                </li>
              ))}
            </ul>
          </Section>
        </div>
        <aside className="space-y-3">
          <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Puntuación IA</div>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-semibold">92</span>
              <span className="pb-1 text-xs text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
              <div className="h-full w-[92%] rounded-full gradient-primary" />
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-surface/40 p-4 text-xs text-muted-foreground">
            Tiempo estimado de contratación: <span className="font-semibold text-foreground">24 días</span>
          </div>
        </aside>
      </div>
    );
  }

  if (id === "descripcion") {
    return (
      <Section title="Descripción del cargo">
        <p>
          Como Ingeniero Senior Frontend, serás responsable de diseñar, construir y mantener las experiencias digitales que millones
          de clientes utilizan cada mes. Trabajarás mano a mano con producto, diseño y datos para llevar ideas desde el
          descubrimiento hasta producción, cuidando el rendimiento, la accesibilidad y la mantenibilidad del código.
        </p>
        <p className="mt-3">
          Buscamos a alguien con criterio técnico, mentalidad de producto y ganas de elevar el estándar del equipo mediante mentoría,
          revisiones de código y evangelización de buenas prácticas.
        </p>
      </Section>
    );
  }

  if (id === "responsabilidades") {
    const items = [
      "Diseñar e implementar interfaces performantes, accesibles y escalables.",
      "Colaborar con producto y diseño para transformar problemas en soluciones medibles.",
      "Definir la arquitectura frontend y las guías técnicas del squad.",
      "Impulsar la calidad mediante testing, revisiones de código y observabilidad.",
      "Mentorizar a ingenieros junior y semi-senior del equipo.",
      "Participar en la estrategia técnica de la plataforma junto al Staff Engineer.",
    ];
    return (
      <Section title="Responsabilidades principales">
        <ul className="space-y-2">
          {items.map((t) => (
            <li key={t} className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/40 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  if (id === "perfil") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Debe tener">
          <ul className="space-y-2">
            {["5+ años en desarrollo frontend en producción", "Experiencia sólida con React y TypeScript", "Dominio de patrones de arquitectura y testing", "Sensibilidad por UX y accesibilidad"].map((t) => (
              <li key={t} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />{t}</li>
            ))}
          </ul>
        </Section>
        <Section title="Deseable">
          <ul className="space-y-2">
            {["Experiencia con GraphQL y micro-frontends", "Contribuciones a open source", "Trabajo previo en e-commerce a gran escala", "Inglés profesional B2+"].map((t) => (
              <li key={t} className="flex items-start gap-2"><Plus className="mt-0.5 h-4 w-4 text-primary" />{t}</li>
            ))}
          </ul>
        </Section>
      </div>
    );
  }

  if (id === "competencias") {
    const soft = ["Comunicación", "Liderazgo técnico", "Pensamiento crítico", "Colaboración"];
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Competencias técnicas">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-medium">{s}</span>
            ))}
          </div>
        </Section>
        <Section title="Competencias blandas">
          <div className="flex flex-wrap gap-2">
            {soft.map((s) => (
              <span key={s} className="rounded-lg bg-accent/15 px-2.5 py-1 text-xs font-medium">{s}</span>
            ))}
          </div>
        </Section>
      </div>
    );
  }

  if (id === "beneficios") {
    const all = [...benefits, "Presupuesto anual de formación", "Días extra de vacaciones", "Plan de acciones"];
    return (
      <Section title="Beneficios y cultura">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((b) => (
            <div key={b} className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/40 p-3">
              <Gift className="h-4 w-4 text-accent" />
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (id === "kpis") {
    const kpis = [
      ["Time-to-market", "-30% en el primer año"],
      ["Core Web Vitals", "≥ 90 en todas las páginas clave"],
      ["Cobertura de tests", "≥ 80% en módulos críticos"],
      ["NPS interno del equipo", "≥ 45"],
    ];
    return (
      <Section title="Indicadores clave de éxito">
        <div className="grid gap-3 sm:grid-cols-2">
          {kpis.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border/60 bg-surface/40 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Gauge className="h-3.5 w-3.5" /> {k}
              </div>
              <div className="mt-1 text-sm text-foreground/90">{v}</div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (id === "star") {
    const qs = [
      ["Situación", "Cuéntame un proyecto frontend complejo en el que hayas participado."],
      ["Tarea", "¿Cuál era tu responsabilidad específica dentro del equipo?"],
      ["Acción", "¿Qué decisiones técnicas tomaste y por qué?"],
      ["Resultado", "¿Qué impacto medible tuvo en el negocio o los usuarios?"],
    ];
    return (
      <Section title="Preguntas de entrevista STAR">
        <ol className="space-y-3">
          {qs.map(([k, q], i) => (
            <li key={k} className="rounded-xl border border-border/60 bg-surface/40 p-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                <MessageSquareQuote className="h-3.5 w-3.5" /> {i + 1}. {k}
              </div>
              <p className="mt-1.5 text-sm">{q}</p>
            </li>
          ))}
        </ol>
      </Section>
    );
  }

  // ATS
  const kw = ["React", "TypeScript", "Frontend Senior", "GraphQL", "AWS", "Accesibilidad", "Core Web Vitals", "E-commerce", "Micro-frontends", "Testing", "CI/CD", "Madrid"];
  return (
    <Section title="Palabras clave optimizadas para ATS">
      <p className="text-muted-foreground">Estas palabras aumentan la visibilidad de la vacante en LinkedIn, Indeed y sistemas ATS internos.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {kw.map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-foreground">
            <Search className="h-3 w-3 text-primary" /> {k}
          </span>
        ))}
      </div>
    </Section>
  );
}

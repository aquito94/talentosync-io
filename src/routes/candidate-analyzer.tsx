import { useEffect, useMemo, useRef, useState } from "react";
import {
  Users, Upload, Sparkles, FileText, Building2, MapPin, Briefcase, Layers,
  CheckCircle2, AlertTriangle, ArrowRight, X, Search, MessageSquareQuote,
  ShieldAlert, Eye, Award, Scale, Users2, UserSearch, BarChart3, Star,
  Download, Trash2, FileType2, ChevronRight, Target, Cpu, Heart, Save,
  Share2, Send, FileDown, ChevronDown, Calendar, GraduationCap, Languages,
  BadgeCheck, Loader2, Mail,
} from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  exportEvaluationPDF, exportEvaluationDOCX, evaluationToText,
  type EvaluationExport,
} from "@/lib/evaluation-export";

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

// ============ Types ============
type Vacancy = {
  id: string;
  cargo: string;
  empresa: string;
  ciudad: string | null;
  departamento: string | null;
  modalidad: string | null;
  nivel: string | null;
  estado: string | null;
  created_at: string;
};

type CvFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  addedAt: Date;
  status: "listo" | "analizando" | "analizado" | "error";
};

type Analysis = {
  id: string;
  fileId: string;
  candidato: string;
  cargoActual: string;
  empresaActual: string;
  compatibilidad: number;
  recomendacion: "A+" | "A" | "B" | "C";
  nivelRecomendacion: string;
  competenciasBadges: string[];
  resumen: string;
  experiencia: string[];
  educacion: string[];
  competenciasTecnicas: { nombre: string; nivel: number }[];
  competenciasBlandas: string[];
  idiomas: string[];
  certificaciones: string[];
  fortalezas: string[];
  riesgos: string[];
  brechas: string[];
  preguntasStar: string[];
  justificacion: string;
  liderazgo: number;
  estabilidad: number;
  ajusteCultural: number;
  aniosExperiencia: number;
};

const QUICK_ACTIONS = [
  { icon: Cpu, title: "Detectar competencias ocultas", desc: "Habilidades transferibles no evidentes en el CV." },
  { icon: Scale, title: "Comparar candidatos", desc: "Matriz de decisión ponderada." },
  { icon: ShieldAlert, title: "Detectar riesgos", desc: "Gaps, rotación alta o sobrecalificación." },
  { icon: MessageSquareQuote, title: "Generar preguntas STAR", desc: "Personalizadas por competencia." },
  { icon: Heart, title: "Calcular ajuste cultural", desc: "Fit con los valores de la empresa." },
];

const PHASES = [
  "Leyendo CV...",
  "Extrayendo competencias...",
  "Comparando con la vacante...",
  "Calculando compatibilidad...",
  "Generando recomendaciones...",
];

const MAX_FILES = 20;
const ACCEPTED = [".pdf", ".docx", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

// ============ Simulación determinista ============
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
function pick<T>(arr: T[], seed: number, n: number): T[] {
  const out: T[] = []; const used = new Set<number>();
  for (let i = 0; i < n && out.length < arr.length; i++) {
    const idx = (seed + i * 31) % arr.length;
    if (!used.has(idx)) { used.add(idx); out.push(arr[idx]); }
  }
  return out;
}

const NOMBRES = ["Elena Ruiz Martín", "David Chen Herrera", "Aisha Khan", "Mateo Silva", "Nina Larsson", "Julien Petit", "Carla Domínguez", "Rafael Ortega", "Sofía Navarro", "Kenji Watanabe", "María López", "Andrés Morales", "Valentina Ríos", "Sebastián Cruz", "Camila Vega", "Diego Restrepo", "Lucía Pardo", "Tomás Aguilar", "Isabel Fuentes", "Nicolás Bermúdez"];
const CARGOS = ["Senior Frontend Engineer", "Fullstack Engineer", "Product Designer", "Engineering Manager", "Data Analyst", "UX Researcher", "DevOps Engineer", "Mobile Engineer"];
const EMPRESAS = ["Nova Retail", "Globant", "Rappi", "Mercado Libre", "Nubank", "Kavak", "Platzi", "Belvo"];
const SKILLS = ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Kubernetes", "PostgreSQL", "Python", "Next.js", "Design Systems", "Tailwind", "Testing", "Liderazgo técnico", "Producto"];
const BLANDAS = ["Comunicación", "Trabajo en equipo", "Pensamiento crítico", "Adaptabilidad", "Resolución de problemas", "Liderazgo", "Empatía"];
const IDIOMAS = ["Español (Nativo)", "Inglés (C1)", "Portugués (B2)", "Francés (B1)"];
const CERTS = ["AWS Solutions Architect", "Scrum Master (PSM I)", "Google UX Design", "Kubernetes CKA"];

function simulate(file: CvFile, vacancy: Vacancy | null): Analysis {
  const seed = hash(file.name);
  const compatibilidad = 55 + (seed % 45);
  const rec: Analysis["recomendacion"] = compatibilidad >= 90 ? "A+" : compatibilidad >= 80 ? "A" : compatibilidad >= 70 ? "B" : "C";
  const nombre = NOMBRES[seed % NOMBRES.length];
  const cargoActual = CARGOS[(seed >> 3) % CARGOS.length];
  const empresaActual = EMPRESAS[(seed >> 5) % EMPRESAS.length];
  const skills = pick(SKILLS, seed, 5);
  const anios = 2 + (seed % 12);
  const cargoVac = vacancy?.cargo ?? "la vacante";
  return {
    id: file.id, fileId: file.id, candidato: nombre, cargoActual, empresaActual, compatibilidad,
    recomendacion: rec,
    nivelRecomendacion: rec === "A+" ? "Altamente recomendado" : rec === "A" ? "Recomendado" : rec === "B" ? "Considerar" : "No recomendado",
    competenciasBadges: skills,
    resumen: `${nombre} suma ${anios} años de experiencia como ${cargoActual} en ${empresaActual}. Perfil compatible con ${cargoVac} por dominio técnico, trayectoria y capacidad de liderazgo.`,
    experiencia: [
      `${cargoActual} — ${empresaActual} · ${anios} años`,
      `Semi Senior — ${EMPRESAS[(seed >> 7) % EMPRESAS.length]} · 3 años`,
      `Junior — ${EMPRESAS[(seed >> 9) % EMPRESAS.length]} · 2 años`,
    ],
    educacion: [
      `Ingeniería de Sistemas — Universidad Nacional`,
      `Especialización en Arquitectura de Software — ${2015 + (seed % 8)}`,
    ],
    competenciasTecnicas: skills.map((s, i) => ({ nombre: s, nivel: 70 + ((seed + i * 7) % 30) })),
    competenciasBlandas: pick(BLANDAS, seed, 4),
    idiomas: pick(IDIOMAS, seed, 2),
    certificaciones: pick(CERTS, seed, 2),
    fortalezas: [
      "Sólida arquitectura y buenas prácticas",
      "Mentoría y liderazgo técnico",
      "Comunicación clara con stakeholders",
      "Orientación a producto y negocio",
    ],
    riesgos: [
      compatibilidad < 80 ? "Experiencia limitada en el stack requerido" : "Duración corta en los últimos 2 roles",
      "Sin experiencia previa en el sector",
    ],
    brechas: [
      `Falta experiencia demostrable en ${SKILLS[(seed >> 11) % SKILLS.length]}`,
      `Nivel intermedio en ${SKILLS[(seed >> 13) % SKILLS.length]}, la vacante pide avanzado`,
    ],
    preguntasStar: [
      `Cuéntame un proyecto complejo como ${cargoActual} y qué decisiones técnicas tomaste.`,
      `Describe una situación en la que lideraste técnicamente a un equipo. ¿Cuál fue el resultado?`,
      `¿Cómo abordaste una mejora significativa de rendimiento o calidad? Cuantifica el impacto.`,
      `Cuenta un conflicto con producto o negocio: tarea, acción y resultado.`,
    ],
    justificacion: `Con ${compatibilidad}% de compatibilidad respecto a "${cargoVac}", el perfil ${rec === "A+" || rec === "A" ? "avanza a entrevista técnica" : "podría considerarse tras validar brechas"}. Trayectoria consistente y competencias core alineadas.`,
    liderazgo: 60 + ((seed >> 2) % 40),
    estabilidad: 55 + ((seed >> 4) % 45),
    ajusteCultural: 65 + ((seed >> 6) % 35),
    aniosExperiencia: anios,
  };
}

function toEvalExport(a: Analysis, v: Vacancy | null): EvaluationExport {
  return {
    candidato: a.candidato, archivo: "", cargoActual: a.cargoActual, empresaActual: a.empresaActual,
    vacante: v?.cargo ?? "—", empresa: v?.empresa ?? "—", ciudad: v?.ciudad ?? "—",
    compatibilidad: a.compatibilidad, recomendacion: `${a.recomendacion} · ${a.nivelRecomendacion}`,
    resumen: a.resumen, fortalezas: a.fortalezas, riesgos: a.riesgos,
    competenciasTecnicas: a.competenciasTecnicas, competenciasBlandas: a.competenciasBlandas,
    experiencia: a.experiencia, educacion: a.educacion, idiomas: a.idiomas,
    certificaciones: a.certificaciones, brechas: a.brechas, preguntasStar: a.preguntasStar,
    justificacion: a.justificacion,
  };
}

async function ensureSession(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.user.id;
  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error) { toast.error("No se pudo iniciar sesión: " + error.message); return null; }
  return anon.session?.user.id ?? null;
}

// ============ Página ============
function CandidateAnalyzerPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loadingVacancies, setLoadingVacancies] = useState(true);
  const [vacancyId, setVacancyId] = useState<string>("");
  const vacancy = useMemo(() => vacancies.find((v) => v.id === vacancyId) ?? null, [vacancies, vacancyId]);

  const [files, setFiles] = useState<CvFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selected, setSelected] = useState<Analysis | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<CvFile | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingVacancies(true);
      const { data, error } = await supabase
        .from("vacantes")
        .select("id, cargo, empresa, ciudad, departamento, modalidad, nivel, estado, created_at")
        .order("created_at", { ascending: false });
      if (error) toast.error("Error cargando vacantes: " + error.message);
      else {
        const list = (data ?? []) as Vacancy[];
        setVacancies(list);
        if (list.length && !vacancyId) setVacancyId(list[0].id);
      }
      setLoadingVacancies(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analyzing = phaseIdx >= 0;

  const addFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    const valid = list.filter((f) => {
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      return ACCEPTED.includes(f.type) || ACCEPTED.includes(ext);
    });
    if (valid.length !== list.length) toast.warning("Solo se aceptan archivos PDF o DOCX.");
    const remaining = Math.max(0, MAX_FILES - files.length);
    if (valid.length > remaining) toast.warning(`Máximo ${MAX_FILES} candidatos. Se ignorarán ${valid.length - remaining}.`);
    const toAdd = valid.slice(0, remaining).map<CvFile>((f) => ({
      id: crypto.randomUUID(), file: f, name: f.name, size: f.size, addedAt: new Date(), status: "listo",
    }));
    setFiles((prev) => [...prev, ...toAdd]);
  };

  const handleAnalyze = async () => {
    if (!vacancy) { toast.error("Selecciona una vacante primero."); return; }
    if (!files.length) { toast.error("Sube al menos un CV."); return; }
    setAnalyses([]);
    for (let i = 0; i < PHASES.length; i++) {
      setPhaseIdx(i);
      const start = (i / PHASES.length) * 100;
      const end = ((i + 1) / PHASES.length) * 100;
      const steps = 20;
      for (let s = 0; s <= steps; s++) {
        await new Promise((r) => setTimeout(r, 45));
        setProgress(start + ((end - start) * s) / steps);
      }
    }
    const results = files.map((f) => simulate(f, vacancy)).sort((a, b) => b.compatibilidad - a.compatibilidad);
    setAnalyses(results);
    setFiles((prev) => prev.map((f) => ({ ...f, status: "analizado" as const })));
    setPhaseIdx(-1); setProgress(0);
    toast.success(`Análisis completado — ${results.length} candidatos evaluados.`);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const saveEvaluation = async (a: Analysis) => {
    if (!vacancy) return;
    setSavingId(a.id);
    try {
      const userId = await ensureSession();
      if (!userId) return;
      const { data: cand, error: cErr } = await supabase.from("candidatos").insert({
        user_id: userId, nombre_completo: a.candidato,
        experiencia_anos: a.aniosExperiencia,
        competencias: a.competenciasBadges,
        resumen_profesional: a.resumen,
      }).select("id").single();
      if (cErr) throw cErr;
      const { error: eErr } = await supabase.from("evaluaciones_ia").insert({
        user_id: userId, vacante_id: vacancy.id, candidato_id: cand.id,
        compatibilidad: a.compatibilidad, resumen_ejecutivo: a.resumen,
        fortalezas: a.fortalezas, riesgos: a.riesgos,
        competencias_detectadas: a.competenciasBadges,
        ajuste_cultural: a.ajusteCultural,
        preguntas_sugeridas: a.preguntasStar.map((p) => ({ pregunta: p })),
        recomendacion: `${a.recomendacion} · ${a.nivelRecomendacion}`,
        modelo_ia: "simulacion-v1",
      });
      if (eErr) throw eErr;
      toast.success(`Evaluación de ${a.candidato} guardada.`);
    } catch (e) {
      toast.error("No se pudo guardar: " + (e as Error).message);
    } finally { setSavingId(null); }
  };

  const shareEvaluation = async (a: Analysis) => {
    const text = evaluationToText(toEvalExport(a, vacancy));
    if (navigator.share) {
      try { await navigator.share({ title: `Evaluación — ${a.candidato}`, text }); return; }
      catch { /* fallback */ }
    }
    try { await navigator.clipboard.writeText(text); toast.success("Evaluación copiada al portapapeles."); }
    catch { toast.error("No se pudo compartir."); }
  };

  const sendHiringManager = (a: Analysis) => {
    const subject = encodeURIComponent(`Candidato recomendado — ${a.candidato} (${a.compatibilidad}%)`);
    const body = encodeURIComponent(evaluationToText(toEvalExport(a, vacancy)));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              Evaluador Inteligente de Candidatos
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              Selecciona una vacante, sube múltiples CV y deja que la IA priorice al mejor talento.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setCompareOpen(true)}
              disabled={analyses.length < 2}
              className="rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-40"
            >
              <Scale className="mr-2 inline h-3.5 w-3.5" /> Comparar
            </button>
          </div>
        </div>

        {/* PASO 1: Selector de vacante */}
        <StepCard step={1} title="Selecciona la vacante" desc="Se cargan automáticamente desde tu base de datos.">
          <VacancySelector
            vacancies={vacancies} loading={loadingVacancies}
            value={vacancyId} onChange={setVacancyId} selected={vacancy}
          />
        </StepCard>

        {/* Main 3-col */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          {/* LEFT: process info */}
          <aside className="glass-panel h-fit rounded-2xl p-5 animate-float-up">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 text-primary" /> Proceso de selección
            </div>
            <h2 className="mt-2 text-base font-semibold tracking-tight">{vacancy?.cargo ?? "Sin vacante seleccionada"}</h2>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={`h-1.5 w-1.5 rounded-full ${vacancy ? "bg-success animate-pulse-glow" : "bg-muted-foreground/40"}`} />
              {vacancy ? `Vacante activa · ${files.length} CV cargados` : "Selecciona una vacante para comenzar"}
            </div>
            <div className="mt-5 space-y-4">
              <InfoRow icon={Briefcase} label="Vacante" value={vacancy?.cargo ?? "—"} />
              <InfoRow icon={Building2} label="Empresa" value={vacancy?.empresa ?? "—"} />
              <InfoRow icon={Layers} label="Departamento" value={vacancy?.departamento ?? "—"} />
              <InfoRow icon={MapPin} label="Ubicación" value={[vacancy?.ciudad, vacancy?.modalidad].filter(Boolean).join(" · ") || "—"} />
            </div>
            <div className="mt-5 border-t border-border/50 pt-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Criterios de evaluación</div>
              <ul className="mt-2 space-y-2 text-xs">
                {[["Experiencia técnica", 35], ["Habilidades blandas", 20], ["Ajuste cultural", 20], ["Trayectoria", 15], ["Formación", 10]].map(([l, w]) => (
                  <li key={l as string} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{l}</span><span className="font-semibold">{w}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CENTER */}
          <section className="space-y-6">
            {/* PASO 2: Upload */}
            <StepCard step={2} title="Sube los candidatos" desc={`PDF o DOCX · máximo ${MAX_FILES} candidatos.`} inline>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                className={`glass-panel relative overflow-hidden rounded-2xl p-8 text-center transition ${dragOver ? "border-primary/60 shadow-glow" : ""}`}
              >
                <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-hero)" }} />
                <div className="relative">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">Arrastra los CV aquí</h3>
                  <p className="mt-1 text-xs text-muted-foreground">PDF o DOCX · hasta {MAX_FILES} candidatos · {files.length}/{MAX_FILES}</p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => inputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-glow"
                    >
                      <Upload className="h-3.5 w-3.5" /> Seleccionar archivos
                    </button>
                    <input
                      ref={inputRef} type="file" accept=".pdf,.docx" multiple hidden
                      onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><FileType2 className="h-3 w-3" /> PDF</span>
                    <span className="inline-flex items-center gap-1"><FileType2 className="h-3 w-3" /> DOCX</span>
                    <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Cifrado end-to-end</span>
                  </div>
                </div>
              </div>
            </StepCard>

            {/* Loaded candidates */}
            {files.length > 0 && (
              <div className="glass-panel rounded-2xl p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold tracking-tight">Candidatos cargados</h3>
                    <p className="text-[11px] text-muted-foreground">{files.length} de {MAX_FILES} archivos</p>
                  </div>
                  <button onClick={() => setFiles([])} className="shrink-0 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                    Limpiar todo
                  </button>
                </div>
                <ul className="mt-4 space-y-2">
                  {files.map((c) => (
                    <li key={c.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-surface/40 p-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                        <FileType2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{c.name}</div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {(c.size / 1024 / 1024).toFixed(2)} MB · {c.addedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          c.status === "analizado" ? "bg-success/15 text-success" :
                          c.status === "analizando" ? "bg-primary/15 text-primary" :
                          c.status === "error" ? "bg-destructive/15 text-destructive" :
                          "bg-muted/40 text-muted-foreground"
                        }`}>
                          {c.status === "listo" ? "Listo" : c.status === "analizando" ? "Analizando…" : c.status === "analizado" ? "Analizado" : "Error"}
                        </span>
                        <button onClick={() => setPreviewFile(c)} title="Vista previa" className="rounded-md p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setFiles((p) => p.filter((x) => x.id !== c.id))} title="Eliminar" className="rounded-md p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PASO 3: Analyze */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Paso 3</div>
                  <h3 className="mt-1 text-base font-semibold tracking-tight">Analiza con IA</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {analyzing ? PHASES[phaseIdx] : `Modelo: Gemini 2.5 Pro · ${files.length} candidatos listos`}
                  </p>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !vacancy || files.length === 0}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl gradient-primary px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
                >
                  {analyzing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analizando…</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Analizar Candidatos con IA <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></>
                  )}
                </button>
              </div>
              {analyzing && (
                <div className="mt-5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-background/60">
                    <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <ul className="mt-4 grid gap-1.5 sm:grid-cols-5">
                    {PHASES.map((p, i) => (
                      <li key={p} className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] transition ${
                        i < phaseIdx ? "border-success/40 bg-success/10 text-success" :
                        i === phaseIdx ? "border-primary/40 bg-primary/10 text-primary" :
                        "border-border/50 text-muted-foreground"
                      }`}>
                        {i < phaseIdx ? <CheckCircle2 className="h-3 w-3" /> : i === phaseIdx ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                        <span className="truncate">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: Copilot */}
          <aside className="space-y-4">
            <div className="glass-panel relative overflow-hidden rounded-2xl p-5">
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
                  Aplica análisis avanzados sobre uno o varios candidatos. El copiloto aprende de tus decisiones.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-3">
              <div className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Acciones rápidas</div>
              <ul className="space-y-1.5">
                {QUICK_ACTIONS.map((a) => (
                  <li key={a.title}>
                    <button className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-transparent bg-surface/40 p-3 text-left transition hover:border-primary/40 hover:bg-primary/5">
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
                <span className="text-[10px] font-semibold text-success">{analyses.length ? "Activo" : "Sin datos"}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                {[
                  [String(analyses.length), "Total", "text-foreground"],
                  [String(analyses.filter((a) => a.compatibilidad >= 85).length), "Alta", "text-success"],
                  [String(analyses.filter((a) => a.compatibilidad >= 70 && a.compatibilidad < 85).length), "Media", "text-primary"],
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

        {/* PASO 4: Resultados */}
        <section ref={resultsRef} className="mt-10">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:flex sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Paso 4</div>
              <h2 className="mt-1 truncate text-xl font-semibold tracking-tight">Candidatos analizados</h2>
              <p className="text-xs text-muted-foreground">Ordenados por compatibilidad con la vacante</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-[11px]">
              <button
                onClick={() => setCompareOpen(true)} disabled={analyses.length < 2}
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-3 py-2 font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-40"
              >
                <Scale className="h-3.5 w-3.5" /> Comparar Candidatos
              </button>
            </div>
          </div>

          {analyses.length === 0 ? (
            <div className="glass-panel mt-5 flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
                <UserSearch className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">Aún no se ha ejecutado el análisis</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Selecciona una vacante, sube los CV y pulsa "Analizar Candidatos con IA" para obtener el ranking completo.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {analyses.map((a, i) => (
                <CandidateCard key={a.id} a={a} onOpen={() => setSelected(a)} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>

      {selected && (
        <DetailDrawer
          a={selected} vacancy={vacancy} onClose={() => setSelected(null)}
          onSave={() => saveEvaluation(selected)}
          onShare={() => shareEvaluation(selected)}
          onSendHM={() => sendHiringManager(selected)}
          saving={savingId === selected.id}
        />
      )}
      {compareOpen && <CompareModal analyses={analyses.slice(0, 5)} onClose={() => setCompareOpen(false)} />}
      {previewFile && <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />}
    </AppShell>
  );
}

// ============ Subcomponentes ============
function StepCard({ step, title, desc, children, inline }: { step: number; title: string; desc: string; children: React.ReactNode; inline?: boolean }) {
  return (
    <div className={`${inline ? "" : "glass-panel mt-6 rounded-2xl p-5"} animate-float-up`}>
      {!inline && (
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-xs font-bold text-white shadow-glow">{step}</div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
            <p className="text-[11px] text-muted-foreground">{desc}</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

function VacancySelector({
  vacancies, loading, value, onChange, selected,
}: { vacancies: Vacancy[]; loading: boolean; value: string; onChange: (v: string) => void; selected: Vacancy | null }) {
  const [open, setOpen] = useState(false);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  const badge = (estado: string | null) => {
    const map: Record<string, string> = {
      publicada: "bg-success/15 text-success", borrador: "bg-muted/40 text-muted-foreground",
      pausada: "bg-warning/15 text-warning", cerrada: "bg-destructive/15 text-destructive",
      archivada: "bg-muted/40 text-muted-foreground",
    };
    return map[estado ?? ""] ?? "bg-primary/15 text-primary";
  };
  return (
    <div className="relative">
      <button
        type="button" onClick={() => setOpen((o) => !o)}
        className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border-strong bg-surface/60 px-4 py-3 text-left transition hover:border-primary/40"
      >
        <span className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-white shadow-glow">
          <Briefcase className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          {loading ? (
            <span className="text-sm text-muted-foreground">Cargando vacantes…</span>
          ) : selected ? (
            <>
              <span className="block truncate text-sm font-semibold">{selected.cargo}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {selected.empresa} · {selected.ciudad ?? "—"} · {fmtDate(selected.created_at)}
                {selected.estado && <span className={`ml-2 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase ${badge(selected.estado)}`}>{selected.estado}</span>}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              {vacancies.length === 0 ? "No hay vacantes guardadas todavía" : "Selecciona una vacante"}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && vacancies.length > 0 && (
        <div className="absolute z-30 mt-2 max-h-96 w-full overflow-auto rounded-xl border border-border-strong bg-background shadow-glow">
          {vacancies.map((v) => (
            <button
              key={v.id} onClick={() => { onChange(v.id); setOpen(false); }}
              className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/40 px-4 py-3 text-left transition hover:bg-primary/5 ${v.id === value ? "bg-primary/10" : ""}`}
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{v.cargo}</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {v.empresa} · {v.ciudad ?? "—"} · {fmtDate(v.created_at)}
                </div>
              </div>
              {v.estado && (
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${badge(v.estado)}`}>{v.estado}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
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

function CandidateCard({ a, onOpen, index }: { a: Analysis; onOpen: () => void; index: number }) {
  const color = a.compatibilidad >= 85 ? "text-success" : a.compatibilidad >= 70 ? "text-primary" : "text-warning";
  const initials = a.candidato.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <article
      className="group glass-panel flex flex-col rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-glow animate-float-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-primary text-sm font-semibold text-white shadow-glow">{initials}</div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight">{a.candidato}</h3>
          <p className="truncate text-[11px] text-muted-foreground">{a.cargoActual} · {a.empresaActual}</p>
        </div>
        <span className={`shrink-0 rounded-md bg-surface/60 px-2 py-0.5 text-[10px] font-semibold ${color}`}>{a.recomendacion}</span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Compatibilidad</span>
          <span className={`font-semibold ${color}`}>{a.compatibilidad}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-background/60">
          <div className="h-full rounded-full gradient-primary" style={{ width: `${a.compatibilidad}%` }} />
        </div>
      </div>
      <div className="mt-3 text-[11px] text-muted-foreground">{a.nivelRecomendacion}</div>
      <div className="mt-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Competencias</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {a.competenciasBadges.map((s) => (
            <span key={s} className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-foreground">{s}</span>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4 text-[11px] text-muted-foreground">
        <span>{a.aniosExperiencia} años exp.</span>
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-2.5 py-1.5 font-semibold text-foreground transition group-hover:bg-primary group-hover:text-white"
        >
          <Eye className="h-3.5 w-3.5" /> Ver análisis completo
        </button>
      </div>
    </article>
  );
}

function DetailDrawer({
  a, vacancy, onClose, onSave, onShare, onSendHM, saving,
}: {
  a: Analysis; vacancy: Vacancy | null; onClose: () => void;
  onSave: () => void; onShare: () => void; onSendHM: () => void; saving: boolean;
}) {
  const initials = a.candidato.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const evalExp = toEvalExport(a, vacancy);
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-border/60 bg-background animate-float-up">
        <div className="sticky top-0 z-10 border-b border-border/60 bg-background/80 p-5 backdrop-blur-xl">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-primary text-sm font-semibold text-white shadow-glow">{initials}</div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold">{a.candidato}</div>
              <div className="truncate text-[11px] text-muted-foreground">{a.cargoActual} · {a.empresaActual} · {a.aniosExperiencia} años</div>
            </div>
            <button onClick={onClose} className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-border/60 bg-surface/40 p-2.5">
              <div className="text-lg font-semibold text-success">{a.compatibilidad}%</div>
              <div className="text-[10px] text-muted-foreground">Compatibilidad</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/40 p-2.5">
              <div className="text-lg font-semibold text-primary">{a.ajusteCultural}%</div>
              <div className="text-[10px] text-muted-foreground">Ajuste cultural</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/40 p-2.5">
              <div className="text-lg font-semibold">{a.recomendacion}</div>
              <div className="text-[10px] text-muted-foreground">Recomendación</div>
            </div>
          </div>

          {/* Actions bar */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <ActionBtn icon={saving ? Loader2 : Save} label={saving ? "Guardando…" : "Guardar evaluación"} onClick={onSave} spin={saving} primary />
            <ActionBtn icon={FileDown} label="Exportar PDF" onClick={() => exportEvaluationPDF(evalExp)} />
            <ActionBtn icon={FileText} label="Exportar Word" onClick={() => exportEvaluationDOCX(evalExp)} />
            <ActionBtn icon={Share2} label="Compartir" onClick={onShare} />
            <ActionBtn icon={Send} label="Enviar al Hiring Manager" onClick={onSendHM} />
            <ActionBtn icon={Download} label="Reporte ejecutivo" onClick={() => exportEvaluationPDF(evalExp)} />
          </div>
        </div>

        <div className="space-y-5 p-5">
          <Block icon={FileText} title="Resumen ejecutivo"><p>{a.resumen}</p></Block>

          <div className="grid gap-4 sm:grid-cols-2">
            <Block icon={Briefcase} title="Experiencia">
              <ul className="space-y-2 text-sm">
                {a.experiencia.map((x) => <li key={x} className="flex items-start gap-2"><Calendar className="mt-0.5 h-4 w-4 text-primary" />{x}</li>)}
              </ul>
            </Block>
            <Block icon={GraduationCap} title="Educación">
              <ul className="space-y-2 text-sm">
                {a.educacion.map((x) => <li key={x} className="flex items-start gap-2"><GraduationCap className="mt-0.5 h-4 w-4 text-primary" />{x}</li>)}
              </ul>
            </Block>
          </div>

          <Block icon={Cpu} title="Competencias técnicas">
            <div className="space-y-2.5">
              {a.competenciasTecnicas.map((k) => (
                <div key={k.nombre}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{k.nombre}</span><span className="font-semibold text-primary">{k.nivel}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${k.nivel}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <div className="grid gap-4 sm:grid-cols-2">
            <Block icon={Users2} title="Competencias blandas">
              <div className="flex flex-wrap gap-1.5">
                {a.competenciasBlandas.map((s) => (
                  <span key={s} className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium">{s}</span>
                ))}
              </div>
            </Block>
            <Block icon={Languages} title="Idiomas">
              <ul className="space-y-1.5 text-sm">
                {a.idiomas.map((x) => <li key={x} className="flex items-center gap-2"><Languages className="h-3.5 w-3.5 text-primary" />{x}</li>)}
              </ul>
            </Block>
          </div>

          <Block icon={BadgeCheck} title="Certificaciones">
            <ul className="space-y-1.5 text-sm">
              {a.certificaciones.map((x) => <li key={x} className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-success" />{x}</li>)}
            </ul>
          </Block>

          <div className="grid gap-4 sm:grid-cols-2">
            <Block icon={Award} title="Fortalezas" tone="success">
              <ul className="space-y-2 text-sm">
                {a.fortalezas.map((f) => <li key={f} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />{f}</li>)}
              </ul>
            </Block>
            <Block icon={ShieldAlert} title="Riesgos" tone="warning">
              <ul className="space-y-2 text-sm">
                {a.riesgos.map((r) => <li key={r} className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />{r}</li>)}
              </ul>
            </Block>
          </div>

          <Block icon={Target} title="Brechas respecto a la vacante" tone="warning">
            <ul className="space-y-2 text-sm">
              {a.brechas.map((b) => <li key={b} className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />{b}</li>)}
            </ul>
          </Block>

          <Block icon={MessageSquareQuote} title="Preguntas STAR sugeridas">
            <ol className="space-y-2 text-sm">
              {a.preguntasStar.map((q, i) => (
                <li key={q} className="rounded-xl border border-border/60 bg-surface/40 p-3">
                  <span className="mr-2 font-semibold text-primary">{i + 1}.</span>{q}
                </li>
              ))}
            </ol>
          </Block>

          <Block icon={Star} title="Recomendación IA" tone="primary">
            <p className="text-sm">
              <span className={`font-semibold ${a.compatibilidad >= 85 ? "text-success" : a.compatibilidad >= 70 ? "text-primary" : "text-warning"}`}>
                {a.nivelRecomendacion} ({a.recomendacion})
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{a.justificacion}</p>
          </Block>
        </div>
      </aside>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, primary, spin }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void; primary?: boolean; spin?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
        primary ? "gradient-primary text-white shadow-glow hover:brightness-110"
                : "border border-border-strong bg-surface/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${spin ? "animate-spin" : ""}`} /> {label}
    </button>
  );
}

function Block({
  icon: Icon, title, tone = "default", children,
}: { icon: React.ComponentType<{ className?: string }>; title: string; tone?: "default" | "success" | "warning" | "primary"; children: React.ReactNode }) {
  const toneCls = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/40 p-4">
      <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${toneCls}`}>
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

function CompareModal({ analyses, onClose }: { analyses: Analysis[]; onClose: () => void }) {
  const ranked = [...analyses].sort((a, b) => b.compatibilidad - a.compatibilidad);
  const rows: { label: string; icon: React.ComponentType<{ className?: string }>; get: (a: Analysis, r: number) => React.ReactNode }[] = [
    { label: "Compatibilidad", icon: BarChart3, get: (a) => <span className="font-semibold text-success">{a.compatibilidad}%</span> },
    { label: "Experiencia", icon: Layers, get: (a) => `${a.aniosExperiencia} años` },
    { label: "Educación", icon: GraduationCap, get: (a) => a.educacion[0] ?? "—" },
    { label: "Competencias", icon: Cpu, get: (a) => (
        <div className="flex flex-wrap gap-1">
          {a.competenciasBadges.slice(0, 3).map((s) => <span key={s} className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium">{s}</span>)}
        </div>
      )
    },
    { label: "Idiomas", icon: Languages, get: (a) => a.idiomas.join(", ") || "—" },
    { label: "Liderazgo", icon: Users2, get: (a) => <span className="font-semibold text-primary">{a.liderazgo}%</span> },
    { label: "Estabilidad laboral", icon: Briefcase, get: (a) => <span className="font-semibold">{a.estabilidad}%</span> },
    { label: "Ajuste cultural", icon: Heart, get: (a) => <span className="font-semibold text-primary">{a.ajusteCultural}%</span> },
    { label: "Ranking final", icon: Star, get: (_a, r) => (
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${r === 0 ? "gradient-primary text-white shadow-glow" : "bg-surface/60"}`}>
          {r + 1}
        </span>
      )
    },
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
            <p className="mt-1 text-[11px] text-muted-foreground">Matriz de decisión ponderada — {ranked.length} candidatos</p>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="sticky top-0 bg-background/95 backdrop-blur">
              <tr className="border-b border-border/60">
                <th className="w-56 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Criterio</th>
                {ranked.map((a) => {
                  const initials = a.candidato.split(" ").map((n) => n[0]).slice(0, 2).join("");
                  return (
                    <th key={a.id} className="px-4 py-3 text-left">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-primary text-[11px] font-semibold text-white">{initials}</div>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold">{a.candidato}</div>
                          <div className="truncate text-[10px] text-muted-foreground">{a.cargoActual}</div>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border/40">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                      <row.icon className="h-3.5 w-3.5 text-primary" /> {row.label}
                    </span>
                  </td>
                  {ranked.map((a, r) => <td key={a.id} className="px-4 py-3 text-xs">{row.get(a, r)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilePreview({ file, onClose }: { file: CvFile; onClose: () => void }) {
  const url = useMemo(() => URL.createObjectURL(file.file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  const isPdf = file.file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-glow">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 p-4">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{file.name}</div>
            <div className="text-[11px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
          <div className="flex items-center gap-2">
            <a href={url} download={file.name} className="rounded-lg border border-border-strong bg-surface/60 px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
              <Download className="mr-1 inline h-3.5 w-3.5" /> Descargar
            </a>
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-surface/40">
          {isPdf ? (
            <iframe src={url} className="h-full w-full" title={file.name} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-sm text-muted-foreground">
              <FileType2 className="h-12 w-12 text-primary" />
              <div>La vista previa embebida no está disponible para DOCX.</div>
              <a href={url} download={file.name} className="rounded-lg gradient-primary px-3 py-1.5 text-xs font-semibold text-white shadow-glow">
                Descargar archivo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

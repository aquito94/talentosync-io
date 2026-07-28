import { useEffect, useMemo, useRef, useState } from "react";
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
  Search,
  MoreHorizontal,
  Building2,
  MapPin,
  Layers,
  Clock,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  User2,
  Trash2,
  Trophy,
  GitCompare,
  ClipboardList,
} from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { askCopilot, type CopilotContext } from "@/lib/copilot.functions";
import {
  listVacantesForCopilot,
  listCandidatosForVacante,
  appendCandidatoNota,
} from "@/lib/copilot-data.functions";


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

// -------- Types --------
type Msg = { id: string; role: "user" | "assistant"; content: string; at: number; saved?: boolean };
type Conversation = {
  id: string;
  vacanteId: string | null;
  vacanteLabel: string;
  title: string;
  messages: Msg[];
  updatedAt: number;
};
type Vacante = {
  id: string;
  cargo: string;
  empresa: string | null;
  ciudad: string | null;
  nivel: string | null;
  modalidad: string | null;
  estado: string | null;
  perfil_ideal: string | null;
  descripcion: string | null;
  objetivo_cargo: string | null;
  competencias: string[] | null;
  updated_at: string | null;
};

type CandidatoCtx = {
  id: string;
  nombre: string;
  compatibilidad: number | null;
  recomendacion: string | null;
  resumen: string | null;
  fortalezas: string[];
  riesgos: string[];
  competencias: string[];
};

const STORAGE_KEY = "recruitai.copilot.conversations.v1";
const ACTIVE_KEY = "recruitai.copilot.active.v1";
const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const quickActions = [
  { icon: FileText, title: "Crear Vacante", prompt: "Ayúdame a redactar una nueva vacante profesional lista para publicar." },
  { icon: Users, title: "Analizar Candidatos", prompt: "Analiza los candidatos actuales de esta vacante y dame un ranking justificado." },
  { icon: GitCompare, title: "Comparar CV", prompt: "Compara los CV de los candidatos evaluados destacando fortalezas, riesgos y encaje cultural." },
  { icon: Wand2, title: "Generar Preguntas STAR", prompt: "Genera 6 preguntas STAR para el candidato con mayor puntuación, cubriendo competencias clave del rol." },
  { icon: Mail, title: "Redactar Correo", prompt: "Redacta un correo profesional para invitar al mejor candidato a una entrevista técnica." },
  { icon: BarChart3, title: "Crear Reporte Ejecutivo", prompt: "Prepara un informe ejecutivo del proceso para el Hiring Manager: estado, top 3 candidatos, riesgos y recomendación final." },
  { icon: ThumbsUp, title: "Recomendar Contratación", prompt: "¿A qué candidato recomendarías contratar y por qué? Da un veredicto ponderado por competencias, experiencia y encaje cultural." },
];

const suggestedQueries = [
  "¿Qué candidato recomiendas?",
  "¿Cuáles son los riesgos de contratar al candidato seleccionado?",
  "Resume las fortalezas del Top 3.",
  "Genera preguntas STAR para el candidato con mayor puntuación.",
  "Redacta un correo para invitar al candidato a entrevista.",
  "Prepara un informe ejecutivo para el Hiring Manager.",
];

// -------- Persistence --------
function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveConversations(list: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function labelOf(v: Vacante | null): string {
  if (!v) return "Sin vacante seleccionada";
  return `${v.cargo}${v.empresa ? ` · ${v.empresa}` : ""}`;
}

function CopilotPage() {
  const askCopilotFn = useServerFn(askCopilot);
  const listVacantesFn = useServerFn(listVacantesForCopilot);
  const listCandidatosFn = useServerFn(listCandidatosForVacante);
  const appendNotaFn = useServerFn(appendCandidatoNota);

  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [activeVacanteId, setActiveVacanteId] = useState<string | null>(null);
  const [candidatos, setCandidatos] = useState<CandidatoCtx[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchHist, setSearchHist] = useState("");
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeVacante = useMemo(
    () => vacantes.find((v) => v.id === activeVacanteId) ?? null,
    [vacantes, activeVacanteId],
  );
  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeConvId) ?? null,
    [conversations, activeConvId],
  );

  // Load conversations from localStorage on mount
  useEffect(() => {
    const list = loadConversations();
    setConversations(list);
    const savedActive = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_KEY) : null;
    if (savedActive && list.some((c) => c.id === savedActive)) setActiveConvId(savedActive);
  }, []);

  // Load vacantes via server function (bypasses RLS for context)
  useEffect(() => {
    (async () => {
      try {
        const list = await listVacantesFn();
        setVacantes(list as Vacante[]);
        if (list.length && !activeVacanteId) setActiveVacanteId(list[0].id);
      } catch (e) {
        console.warn("[copilot] cargar vacantes:", e instanceof Error ? e.message : e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When active vacante changes, load its candidatos
  useEffect(() => {
    if (!activeVacanteId) {
      setCandidatos([]);
      return;
    }
    (async () => {
      try {
        const rows = await listCandidatosFn({ data: { vacanteId: activeVacanteId } });
        setCandidatos(rows as CandidatoCtx[]);
      } catch (e) {
        console.warn("[copilot] cargar evaluaciones:", e instanceof Error ? e.message : e);
        setCandidatos([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVacanteId]);


  // Auto scroll on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeConv?.messages.length, loading]);

  // Persist conversations
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);
  useEffect(() => {
    if (activeConvId && typeof window !== "undefined") localStorage.setItem(ACTIVE_KEY, activeConvId);
  }, [activeConvId]);

  const groupedHistory = useMemo(() => {
    const groups = new Map<string, Conversation[]>();
    conversations
      .filter((c) => (searchHist ? c.title.toLowerCase().includes(searchHist.toLowerCase()) : true))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .forEach((c) => {
        const key = c.vacanteLabel || "Sin vacante";
        const arr = groups.get(key) ?? [];
        arr.push(c);
        groups.set(key, arr);
      });
    return Array.from(groups.entries());
  }, [conversations, searchHist]);

  const bestCandidate = candidatos[0] ?? null;

  const newChat = () => {
    const conv: Conversation = {
      id: uid(),
      vacanteId: activeVacanteId,
      vacanteLabel: labelOf(activeVacante),
      title: "Nueva conversación",
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
    setInput("");
    setTimeout(() => composerRef.current?.focus(), 30);
  };

  const deleteConv = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
  };

  const ensureConversation = (): Conversation => {
    if (activeConv) return activeConv;
    const conv: Conversation = {
      id: uid(),
      vacanteId: activeVacanteId,
      vacanteLabel: labelOf(activeVacante),
      title: "Nueva conversación",
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
    return conv;
  };

  const buildContext = (): CopilotContext => ({
    vacante: activeVacante
      ? {
          cargo: activeVacante.cargo,
          empresa: activeVacante.empresa ?? undefined,
          ciudad: activeVacante.ciudad ?? undefined,
          nivel: activeVacante.nivel ?? undefined,
          modalidad: activeVacante.modalidad ?? undefined,
          estado: activeVacante.estado ?? undefined,
          resumen: activeVacante.perfil_ideal ?? activeVacante.objetivo_cargo ?? undefined,
          descripcion: activeVacante.descripcion ?? undefined,
          competencias: activeVacante.competencias ?? undefined,
          updated_at: activeVacante.updated_at ?? undefined,
        }
      : null,
    candidatos: candidatos.map((c) => ({
      nombre: c.nombre,
      compatibilidad: c.compatibilidad,
      recomendacion: c.recomendacion,
      resumen: c.resumen,
      fortalezas: c.fortalezas,
      riesgos: c.riesgos,
      competencias: c.competencias,
    })),
  });

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const conv = ensureConversation();
    const userMsg: Msg = { id: uid(), role: "user", content: trimmed, at: Date.now() };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              title: c.messages.length === 0 ? trimmed.slice(0, 60) : c.title,
              vacanteId: activeVacanteId,
              vacanteLabel: labelOf(activeVacante),
              updatedAt: Date.now(),
            }
          : c,
      ),
    );
    setInput("");
    setLoading(true);
    try {
      const history = [...(conv.messages.map((m) => ({ role: m.role, content: m.content }))), { role: "user" as const, content: trimmed }];
      const res = await askCopilotFn({ data: { messages: history, context: buildContext() } });
      const aiMsg: Msg = { id: uid(), role: "assistant", content: res.content, at: Date.now() };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conv.id ? { ...c, messages: [...c.messages, aiMsg], updatedAt: Date.now() } : c,
        ),
      );
    } catch (e) {
      const err = e instanceof Error ? e.message : "No se pudo obtener respuesta";
      toast.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => composerRef.current?.focus(), 30);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const onAttach = () => fileInputRef.current?.click();
  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 200_000) { toast.error("El archivo supera 200 KB. Adjunta un fragmento más corto."); return; }
    try {
      const text = await f.text();
      const preface = `Contenido adjunto (${f.name}):\n"""\n${text.slice(0, 12000)}\n"""\n\n`;
      setInput((prev) => preface + prev);
      composerRef.current?.focus();
      toast.success(`Adjuntado: ${f.name}`);
    } catch {
      toast.error("No se pudo leer el archivo.");
    }
  };

  const renameActive = () => {
    if (!activeConv) return;
    const next = window.prompt("Nuevo título de la conversación", activeConv.title);
    if (!next) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConv.id ? { ...c, title: next.slice(0, 80), updatedAt: Date.now() } : c)),
    );
  };
  const clearActive = () => {
    if (!activeConv) return;
    if (!window.confirm("¿Vaciar todos los mensajes de esta conversación?")) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConv.id ? { ...c, messages: [], updatedAt: Date.now() } : c)),
    );
  };
  const [menuOpen, setMenuOpen] = useState(false);

  // Actions on AI messages
  const copyMsg = async (m: Msg) => {
    try {
      await navigator.clipboard.writeText(m.content);
      toast.success("Copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar");
    }
  };
  const toggleSave = (m: Msg) => {
    if (!activeConv) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? { ...c, messages: c.messages.map((x) => (x.id === m.id ? { ...x, saved: !x.saved } : x)) }
          : c,
      ),
    );
    toast.success(m.saved ? "Respuesta eliminada de guardados" : "Respuesta guardada");
  };
  const exportPdf = async (m: Msg) => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 48;
      let y = margin;
      doc.setFillColor(37, 99, 235); doc.rect(0, 0, pageW, 8, "F");
      doc.setFillColor(124, 58, 237); doc.rect(pageW / 2, 0, pageW / 2, 8, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(17, 24, 39);
      doc.text("RecruitAI OS · Copiloto IA", margin, margin);
      y = margin + 22;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(107, 114, 128);
      doc.text(`Vacante: ${labelOf(activeVacante)}`, margin, y); y += 14;
      doc.text(new Date(m.at).toLocaleString("es-ES"), margin, y); y += 20;
      doc.setFontSize(11); doc.setTextColor(17, 24, 39);
      const lines = doc.splitTextToSize(m.content, pageW - margin * 2);
      for (const line of lines) {
        if (y > pageH - margin) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += 14;
      }
      doc.save(`Copiloto_${new Date(m.at).toISOString().slice(0, 10)}.pdf`);
    } catch {
      toast.error("No se pudo exportar el PDF");
    }
  };
  const sendByMail = (m: Msg) => {
    const subj = encodeURIComponent(`Copiloto IA · ${labelOf(activeVacante)}`);
    const body = encodeURIComponent(m.content);
    window.open(`mailto:?subject=${subj}&body=${body}`);
  };
  const [expedienteFor, setExpedienteFor] = useState<Msg | null>(null);
  const openExpediente = (m: Msg) => {
    if (candidatos.length === 0) { toast.error("Analiza candidatos primero para agregar notas a un expediente."); return; }
    setExpedienteFor(m);
  };
  const addToExpediente = async (m: Msg, candidatoId: string) => {
    const target = candidatos.find((c) => c.id === candidatoId);
    if (!target) return;
    try {
      const stamp = new Date().toLocaleString("es-ES");
      const nota = `[Copiloto IA · ${stamp}]\n${m.content}`;
      await appendNotaFn({ data: { candidatoId: target.id, nota } });
      toast.success(`Agregado al expediente de ${target.nombre}`);
      setExpedienteFor(null);
    } catch (e) {
      const err = e instanceof Error ? e.message : "No se pudo actualizar el expediente";
      toast.error(err);
    }
  };


  const stageLabel = activeVacante?.estado
    ? activeVacante.estado.charAt(0).toUpperCase() + activeVacante.estado.slice(1).replaceAll("_", " ")
    : "Sin proceso activo";

  return (
    <AppShell>
      <div className="grid h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
        {/* LEFT: History */}
        <aside className="hidden flex-col border-r border-border/60 bg-sidebar/40 lg:flex">
          <div className="p-4">
            <button
              onClick={newChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> Nuevo chat
            </button>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-xs text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              <input
                value={searchHist}
                onChange={(e) => setSearchHist(e.target.value)}
                placeholder="Buscar en el historial…"
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-6">
            {vacantes.length > 0 && (
              <div className="mb-4 px-1">
                <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Proceso activo
                </div>
                <select
                  value={activeVacanteId ?? ""}
                  onChange={(e) => setActiveVacanteId(e.target.value || null)}
                  className="w-full rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-xs text-foreground outline-none"
                >
                  {vacantes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.cargo}{v.empresa ? ` · ${v.empresa}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {groupedHistory.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-surface/30 p-4 text-center text-xs text-muted-foreground">
                Aún no tienes conversaciones. Presiona <span className="font-semibold text-foreground">Nuevo chat</span> para empezar.
              </div>
            )}

            {groupedHistory.map(([label, convs]) => (
              <div key={label} className="mt-5">
                <div className="flex items-center gap-2 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Briefcase className="h-3 w-3 text-primary" />
                  <span className="truncate">{label}</span>
                </div>
                <ul className="space-y-1">
                  {convs.map((c) => {
                    const isActive = c.id === activeConvId;
                    const when = new Date(c.updatedAt).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
                    return (
                      <li key={c.id} className="group">
                        <div
                          className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                            isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-surface/40 hover:text-foreground"
                          }`}
                        >
                          <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                          <button
                            onClick={() => setActiveConvId(c.id)}
                            className="min-w-0 text-left"
                          >
                            <span className="block truncate font-medium">{c.title}</span>
                            <span className="text-[10px] text-muted-foreground">{when}</span>
                          </button>
                          <button
                            onClick={() => deleteConv(c.id)}
                            className="rounded-md p-1 text-muted-foreground/60 opacity-0 transition hover:bg-surface hover:text-destructive group-hover:opacity-100"
                            aria-label="Eliminar conversación"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER: Chat */}
        <section className="flex min-w-0 flex-col">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-6 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary shadow-glow">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">RecruitAI Copilot</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  Enterprise · {labelOf(activeVacante)}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-[11px] font-semibold text-success sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" /> En línea
              </span>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="rounded-xl border border-border-strong bg-surface/60 p-2 text-muted-foreground hover:text-foreground"
                  aria-label="Más acciones"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-border-strong bg-popover shadow-lg">
                      <button
                        onClick={() => { setMenuOpen(false); renameActive(); }}
                        disabled={!activeConv}
                        className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-primary/10 disabled:opacity-50"
                      >
                        Renombrar conversación
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); clearActive(); }}
                        disabled={!activeConv || activeConv.messages.length === 0}
                        className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-primary/10 disabled:opacity-50"
                      >
                        Vaciar mensajes
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); if (activeConv) deleteConv(activeConv.id); }}
                        disabled={!activeConv}
                        className="block w-full px-3 py-2 text-left text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        Eliminar conversación
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-8">
              {(!activeConv || activeConv.messages.length === 0) && (
                <>
                  <WelcomeCard />
                  <div>
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Acciones rápidas
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {quickActions.map((a, i) => (
                        <button
                          key={a.title}
                          onClick={() => void sendMessage(a.prompt)}
                          disabled={loading}
                          className="group glass-panel flex items-start gap-3 rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:shadow-glow animate-float-up disabled:opacity-60"
                          style={{ animationDelay: `${i * 40}ms` }}
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-white">
                            <a.icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">{a.title}</span>
                            <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                              Enviar consulta al Copiloto.
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeConv?.messages.map((m) =>
                m.role === "user" ? (
                  <UserBubble key={m.id} text={m.content} />
                ) : (
                  <AiReport
                    key={m.id}
                    msg={m}
                    onCopy={() => copyMsg(m)}
                    onSave={() => toggleSave(m)}
                    onExport={() => void exportPdf(m)}
                    onSend={() => sendByMail(m)}
                    onExpediente={() => openExpediente(m)}
                  />
                ),
              )}
              {loading && <TypingBubble />}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-border/60 bg-background/70 px-6 py-4 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestedQueries.map((s) => (
                  <button
                    key={s}
                    onClick={() => void sendMessage(s)}
                    disabled={loading}
                    className="rounded-full border border-border-strong bg-surface/60 px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-60"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 rounded-2xl border border-border-strong bg-surface/60 p-2 transition focus-within:border-primary/60 focus-within:shadow-glow">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
                  <div className="flex items-center gap-1 pl-1">
                    <input ref={fileInputRef} type="file" accept=".txt,.md,.json,.csv,text/*" className="hidden" onChange={onFilePicked} />
                    <button onClick={onAttach} className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground" title="Adjuntar texto (.txt, .md, .json, .csv)">
                      <Paperclip className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    ref={composerRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    placeholder="Pregúntale al Copiloto sobre vacantes, candidatos, entrevistas o reportes…"
                    className="min-h-[40px] max-h-[160px] w-full resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  onClick={() => void sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary text-white shadow-glow transition disabled:opacity-50"
                  aria-label="Enviar"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Modelo: RecruitAI · Gemini 2.5 Flash · Contexto: {labelOf(activeVacante)}</span>
                <span>Presiona <kbd className="rounded border border-border bg-surface/60 px-1">↵</kbd> para enviar · <kbd className="rounded border border-border bg-surface/60 px-1">Shift</kbd>+<kbd className="rounded border border-border bg-surface/60 px-1">↵</kbd> nueva línea</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Context */}
        <aside className="hidden overflow-y-auto border-l border-border/60 bg-sidebar/40 p-5 lg:block">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Contexto del Proceso
          </div>
          <h3 className="mt-2 text-base font-semibold tracking-tight">
            {activeVacante?.cargo ?? "Sin vacante"}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
            {activeVacante ? "Proceso activo" : "Selecciona una vacante en el panel izquierdo"}
          </div>

          <div className="mt-5 space-y-4">
            <ContextRow icon={Briefcase} label="Vacante" value={activeVacante?.cargo ?? "—"} />
            <ContextRow icon={Building2} label="Empresa" value={activeVacante?.empresa ?? "—"} />
            <ContextRow icon={MapPin} label="Ciudad" value={activeVacante?.ciudad ?? "—"} />
            <ContextRow icon={Layers} label="Etapa" value={stageLabel} />
          </div>

          <div className="mt-5 rounded-2xl border border-border/60 bg-surface/40 p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <Stat label="Candidatos" value={String(candidatos.length)} tone="text-foreground" />
              <Stat label="Alta compat." value={String(candidatos.filter((c) => (c.compatibilidad ?? 0) >= 80).length)} tone="text-success" />
              <Stat label="Recomendados" value={String(candidatos.filter((c) => (c.recomendacion ?? "").toLowerCase().includes("recom")).length)} tone="text-primary" />
              <Stat label="Con riesgos" value={String(candidatos.filter((c) => (c.riesgos?.length ?? 0) > 0).length)} tone="text-warning" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border/60 bg-surface/40 p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Trophy className="h-3 w-3 text-primary" /> Candidato mejor puntuado
            </div>
            {bestCandidate ? (
              <div className="mt-2">
                <div className="text-sm font-semibold">{bestCandidate.nombre}</div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded-md bg-success/15 px-2 py-0.5 font-semibold text-success">
                    {bestCandidate.compatibilidad ?? "—"}%
                  </span>
                  <span className="truncate">{bestCandidate.recomendacion ?? "Sin recomendación"}</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                  <div
                    className="h-full rounded-full gradient-primary"
                    style={{ width: `${Math.min(100, bestCandidate.compatibilidad ?? 0)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-muted-foreground">
                Analiza candidatos en el módulo de evaluación para verlos aquí.
              </p>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-border/60 bg-surface/40 p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Clock className="h-3 w-3 text-primary" /> Actualización
            </div>
            <div className="mt-2 text-sm font-medium">
              {activeVacante?.updated_at
                ? new Date(activeVacante.updated_at).toLocaleString("es-ES", {
                    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })
                : "—"}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <ClipboardList className="h-3 w-3 text-primary" /> Top candidatos
            </div>
            <ul className="space-y-2">
              {candidatos.slice(0, 4).map((c) => (
                <li key={c.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-surface/40 p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-primary text-[11px] font-semibold text-white">
                    {c.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{c.nombre}</span>
                    <span className="block text-[11px] text-muted-foreground">{c.recomendacion ?? "—"}</span>
                  </span>
                  <span className="rounded-md bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                    {c.compatibilidad ?? "—"}%
                  </span>
                </li>
              ))}
              {candidatos.length === 0 && (
                <li className="rounded-xl border border-dashed border-border/60 bg-surface/30 p-3 text-center text-[11px] text-muted-foreground">
                  Sin candidatos analizados aún.
                </li>
              )}
            </ul>
          </div>
        </aside>
      </div>
      {expedienteFor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm" onClick={() => setExpedienteFor(null)}>
          <div className="glass-panel w-full max-w-md overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-border/60 p-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Agregar al expediente</div>
              <h3 className="mt-1 text-base font-semibold">Selecciona el candidato</h3>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-3">
              <ul className="space-y-1">
                {candidatos.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => void addToExpediente(expedienteFor, c.id)}
                      className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-surface/40 p-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-primary text-[11px] font-semibold text-white">
                        {c.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{c.nombre}</span>
                        <span className="block text-[11px] text-muted-foreground">{c.recomendacion ?? "—"}</span>
                      </span>
                      <span className="rounded-md bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                        {c.compatibilidad ?? "—"}%
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end border-t border-border/60 p-3">
              <button onClick={() => setExpedienteFor(null)} className="rounded-lg border border-border-strong bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

// -------- UI helpers --------
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
            Hola, soy <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RecruitAI Copilot</span>.
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
        <div className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-glow whitespace-pre-wrap">
          {text}
        </div>
        <span className="pr-1 text-right text-[10px] text-muted-foreground">Tú · ahora</span>
      </div>
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-surface-elevated text-xs font-semibold">
        <User2 className="h-4 w-4" />
      </div>
    </div>
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

// Simple markdown-lite renderer for AI reports
function renderReport(text: string) {
  const lines = text.split(/\r?\n/);
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flushList = (key: number) => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${key}`} className="my-2 space-y-1 pl-1">
        {list.map((it, i) => (
          <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{renderInline(it)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };
  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (/^\s*[-•]\s+/.test(line)) {
      list.push(line.replace(/^\s*[-•]\s+/, ""));
      return;
    }
    flushList(idx);
    if (!line.trim()) return;
    if (/^\*\*.+\*\*:?$/.test(line.trim())) {
      out.push(
        <h4 key={idx} className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          {line.replace(/\*\*/g, "").replace(/:$/, "")}
        </h4>,
      );
      return;
    }
    if (/^#{1,3}\s+/.test(line)) {
      out.push(
        <h4 key={idx} className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          {line.replace(/^#{1,3}\s+/, "")}
        </h4>,
      );
      return;
    }
    out.push(
      <p key={idx} className="my-1.5 leading-relaxed">
        {renderInline(line)}
      </p>,
    );
  });
  flushList(lines.length);
  return out;
}
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p) ? (
      <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function AiReport({
  msg,
  onCopy,
  onSave,
  onExport,
  onSend,
  onExpediente,
}: {
  msg: Msg;
  onCopy: () => void;
  onSave: () => void;
  onExport: () => void;
  onSend: () => void;
  onExpediente: () => void;
}) {
  return (
    <div className="flex gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl gradient-primary text-white shadow-glow">
        <Bot className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">RecruitAI Copilot</span>
          <span>· informe generado</span>
        </div>
        <div className="glass-panel rounded-2xl border border-border/60 p-5 text-sm leading-relaxed text-foreground/90">
          {renderReport(msg.content)}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <ActionChip icon={Copy} label="Copiar" onClick={onCopy} />
          <ActionChip icon={Save} label={msg.saved ? "Guardado" : "Guardar"} onClick={onSave} active={msg.saved} />
          <ActionChip icon={Download} label="Exportar PDF" onClick={onExport} />
          <ActionChip icon={Send} label="Enviar" onClick={onSend} />
          <ActionChip icon={FolderPlus} label="Agregar al expediente" onClick={onExpediente} />
        </div>
      </div>
    </div>
  );
}

function ActionChip({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
        active
          ? "border-primary/60 bg-primary/15 text-foreground"
          : "border-border-strong bg-surface/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-3 w-3" /> {label}
    </button>
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

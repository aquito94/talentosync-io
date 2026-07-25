import { useState } from "react";
import { Send, Inbox, Star, Paperclip, Search, Sparkles, ChevronRight, Bot, Plus } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/smart-emails")({
  head: () => ({
    meta: [
      { title: "Correos Inteligentes — RecruitAI OS" },
      { name: "description", content: "Contacto personalizado a escala: secuencias, respuestas y agendamiento potenciados por el contexto del candidato." },
      { property: "og:title", content: "Correos Inteligentes — RecruitAI OS" },
      { property: "og:description", content: "Contacto personalizado a escala: secuencias, respuestas y agendamiento potenciados por el contexto del candidato." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartEmailsPage,
});

const folders = [
  { icon: Inbox, label: "Bandeja de entrada", count: 12 },
  { icon: Star, label: "Destacados", count: 4 },
  { icon: Send, label: "Enviados", count: 128 },
  { icon: Bot, label: "Borradores IA", count: 6 },
];

const emails = [
  { from: "Elena Ruiz", subject: "Re: Ingeniera Frontend Senior — Entrevista", preview: "Gracias Álvaro, el jueves a las 15:00 me viene perfecto. Con muchas ganas…", when: "hace 2 min", unread: true, tag: "Entrevista" },
  { from: "David Chen", subject: "Interesado en el puesto en RecruitAI OS", preview: "Hola Álvaro, vi tu mensaje — encantado de tener una llamada la próxima semana.", when: "hace 1 h", unread: true, tag: "Respuesta" },
  { from: "Operaciones de Talento", subject: "Resumen semanal del pipeline", preview: "12 nuevos aplicantes, 3 contrataciones esta semana, tiempo medio 11 días.", when: "hace 3 h", tag: "Reporte" },
  { from: "Aisha Khan", subject: "¿Café el próximo martes?", preview: "Me encantaría saber más del rol Staff y del equipo.", when: "hace 1 d", tag: "Respuesta" },
  { from: "Mateo Silva", subject: "CV adjunto — Backend Senior", preview: "Adjunto mi CV actualizado. Disponible para conversar.", when: "hace 2 d", tag: "Nuevo" },
];

function SmartEmailsPage() {
  const [openId, setOpenId] = useState(0);

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)] min-w-0">
        <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border/60 bg-sidebar/40 p-4">
          <button className="flex items-center justify-center gap-2 rounded-xl gradient-primary py-2.5 text-sm font-semibold text-white shadow-glow">
            <Plus className="h-4 w-4" /> Redactar
          </button>
          <ul className="mt-6 space-y-1">
            {folders.map((f, i) => (
              <li key={f.label}>
                <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${i === 0 ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-surface/40 hover:text-foreground"}`}>
                  <f.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{f.label}</span>
                  <span className="text-[10px] text-muted-foreground">{f.count}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Secuencias</div>
          <ul className="mt-2 space-y-1 text-sm">
            {["Ingenieros Senior T2", "Diseñadores de Producto", "Reactivación de Ventas"].map((s) => (
              <li key={s}>
                <button className="w-full rounded-lg px-3 py-2 text-left text-xs text-muted-foreground hover:bg-surface/40 hover:text-foreground">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* List */}
        <div className="hidden md:flex md:w-[300px] lg:w-[360px] shrink-0 flex-col border-r border-border/60 min-w-0">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Buscar en la bandeja…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <ul className="flex-1 overflow-y-auto">
            {emails.map((e, i) => (
              <li key={i}>
                <button
                  onClick={() => setOpenId(i)}
                  className={`w-full border-b border-border/40 px-4 py-4 text-left transition ${i === openId ? "bg-primary/10" : "hover:bg-surface/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate">{e.from}</span>
                    <span className="text-[10px] text-muted-foreground">{e.when}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {e.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />}
                    <span className={`truncate text-xs ${e.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>{e.subject}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{e.preview}</p>
                  <span className="mt-2 inline-block rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{e.tag}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Reader */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-3 border-b border-border/60 px-4 py-4 sm:px-6">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary text-sm font-semibold text-white shadow-glow">
              {emails[openId].from.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{emails[openId].subject}</div>
              <div className="text-xs text-muted-foreground truncate">
                {emails[openId].from} · para Álvaro Morán · {emails[openId].when}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="rounded-xl border border-border-strong bg-surface/60 px-3 py-1.5 text-xs">Responder</button>
              <button className="rounded-xl gradient-primary px-3 py-1.5 text-xs font-semibold text-white shadow-glow">
                <Sparkles className="mr-1 inline h-3 w-3" /> Respuesta IA
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 text-sm leading-relaxed text-foreground/90">
            <p>Hola Álvaro,</p>
            <p className="mt-3">
              Gracias por contactarme sobre el puesto de Ingeniera Frontend Senior en RecruitAI OS — llevo tiempo siguiendo el producto y me encanta la dirección que están tomando con el Copiloto.
            </p>
            <p className="mt-3">
              El jueves a las 15:00 CET me viene perfecto. Envíame la invitación al calendario y cualquier material de preparación que quieras que revise antes.
            </p>
            <p className="mt-3">Un saludo,<br />Elena</p>
          </div>

          {/* AI Suggestion */}
          <div className="border-t border-border/60 p-4">
            <div className="glass-panel rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Bot className="h-4 w-4 text-primary" /> Respuesta sugerida por el Copiloto
                <span className="ml-auto text-[10px] text-muted-foreground">Personalizada · Cercana</span>
              </div>
              <p className="mt-2 text-sm text-foreground/90">
                Perfecto Elena — invitación enviada para el jueves a las 15:00 CET. Adjunté un breve documento de preparación con el roadmap y el equipo con el que trabajarías. ¡Nos vemos!
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button className="rounded-lg gradient-primary px-3 py-1.5 text-xs font-semibold text-white shadow-glow">
                  <Send className="mr-1 inline h-3 w-3" /> Enviar ahora
                </button>
                <button className="rounded-lg border border-border-strong bg-surface/60 px-3 py-1.5 text-xs">Editar</button>
                <button className="rounded-lg border border-border-strong bg-surface/60 px-3 py-1.5 text-xs">
                  <Paperclip className="mr-1 inline h-3 w-3" /> Adjuntar
                </button>
                <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
                  Regenerar <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

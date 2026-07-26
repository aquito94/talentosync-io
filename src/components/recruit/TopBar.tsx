import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Menu, Search } from "lucide-react";
import { useShell } from "./AppShell";

const labels: Record<string, string> = {
  "": "Inicio",
  "job-generator": "Generador Inteligente de Vacantes",
  "candidate-analyzer": "Evaluador Inteligente de Candidatos",
  "recruit-copilot": "Copiloto IA para Reclutadores",
  "smart-emails": "Correos Inteligentes",
  "analytics": "Analítica y KPIs",
  "prompt-library": "Biblioteca de Prompts",
  "settings": "Configuración",
};

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);
  const current = segments.length === 0 ? "Inicio" : labels[segments[0]] ?? segments[0];
  const { setMobileOpen } = useShell();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:gap-4 sm:px-6">
      {/* Trigger móvil / tablet */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú de navegación"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border-strong bg-surface/60 text-muted-foreground transition hover:text-foreground lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden min-w-0 lg:flex items-center gap-1.5 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
          RecruitAI OS
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
        <span className="font-medium text-foreground truncate">{current}</span>
      </nav>

      {/* Título compacto en pantallas medias/pequeñas */}
      <div className="min-w-0 flex-1 lg:hidden">
        <div className="truncate text-sm font-semibold text-foreground">{current}</div>
      </div>

      <div className="ml-auto" />

      <div className="flex items-center gap-2">

        <div className="ml-1 flex items-center gap-2.5 rounded-xl border border-border-strong bg-surface/60 px-2 py-1 pr-2 transition hover:bg-surface sm:pr-3">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg gradient-primary text-xs font-semibold text-white">
            ÁM
          </div>
          <div className="hidden xl:block leading-tight min-w-0">
            <div className="text-xs font-semibold truncate">Álvaro Morán</div>
            <div className="text-[10px] text-muted-foreground truncate">Director de Talento</div>
          </div>
          <ChevronDown className="hidden sm:block h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}

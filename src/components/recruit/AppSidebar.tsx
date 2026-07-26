import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Users,
  Mail,
  Bot,
  BarChart3,
  BookOpen,
  Settings,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useShell } from "./AppShell";

type NavItem = {
  icon: typeof LayoutDashboard;
  label: string;
  to: string;
  badge?: string;
};

const nav: NavItem[] = [
  { icon: LayoutDashboard, label: "Inicio", to: "/" },
  { icon: FileText, label: "Generador Inteligente de Vacantes", to: "/job-generator" },
  { icon: Users, label: "Evaluador Inteligente de Candidatos", to: "/candidate-analyzer" },
  { icon: Bot, label: "Copiloto IA para Reclutadores", to: "/recruit-copilot", badge: "IA" },
  { icon: Mail, label: "Correos Inteligentes", to: "/smart-emails" },
  { icon: BarChart3, label: "Analítica y KPIs", to: "/analytics" },
  { icon: BookOpen, label: "Biblioteca de Prompts", to: "/prompt-library" },
];

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-6 shrink-0">
        <div className="relative grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight truncate">RecruitAI OS</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Empresa
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-3">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Espacio de trabajo
        </div>
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = isActive(item.to);
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full gradient-primary" />
                  )}
                  <item.icon
                    className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                      active
                        ? "text-primary"
                        : "text-sidebar-foreground/55 group-hover:text-primary"
                    }`}
                    strokeWidth={1.75}
                  />
                  <span className="flex-1 min-w-0 truncate text-left font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="shrink-0 rounded-md gradient-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-glow">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Cuenta
        </div>
        <ul className="space-y-1">
          <li>
            <Link
              to="/settings"
              onClick={onNavigate}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                isActive("/settings")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Settings
                className={`h-[18px] w-[18px] shrink-0 ${
                  isActive("/settings")
                    ? "text-primary"
                    : "text-sidebar-foreground/55 group-hover:text-primary"
                }`}
                strokeWidth={1.75}
              />
              <span className="font-medium">Configuración</span>
            </Link>
          </li>
        </ul>
      </nav>

    </div>
  );
}

export function AppSidebar() {
  const { mobileOpen, setMobileOpen } = useShell();
  return (
    <>
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarInner />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[280px] max-w-[85vw] border-r border-sidebar-border bg-sidebar p-0 text-sidebar-foreground lg:hidden"
        >
          <SidebarInner onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}

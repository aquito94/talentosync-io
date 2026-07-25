import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Brain,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  Sparkles,
  Search,
} from "lucide-react";

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Briefcase, label: "Vacantes", badge: "24" },
  { icon: Users, label: "Candidatos", badge: "1.2k" },
  { icon: Brain, label: "AI Screening" },
  { icon: MessageSquare, label: "Entrevistas" },
  { icon: Calendar, label: "Agenda" },
  { icon: BarChart3, label: "Analytics" },
];

export function AppSidebar() {
  return (
    <aside className="hidden lg:flex w-[264px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
        <div className="relative grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight">RecruitAI</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Enterprise OS</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-xs text-muted-foreground">
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1">Buscar…</span>
          <kbd className="rounded border border-sidebar-border bg-background/40 px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-6 flex-1 px-3">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </div>
        <ul className="space-y-0.5">
          {nav.map((item) => (
            <li key={item.label}>
              <Link
                to="/"
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-inner"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 shrink-0 ${item.active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-primary"}`}
                  strokeWidth={2}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="rounded-md border border-sidebar-border bg-background/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {item.badge}
                  </span>
                )}
                {item.active && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Cuenta
        </div>
        <ul className="space-y-0.5">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/75 transition-all hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            >
              <Settings className="h-4 w-4 text-sidebar-foreground/60" />
              Ajustes
            </Link>
          </li>
        </ul>
      </nav>

      {/* AI Credits card */}
      <div className="p-4">
        <div className="glass-panel relative overflow-hidden rounded-xl p-4">
          <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>AI Credits</span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">18,240</div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
              <div className="h-full w-[72%] rounded-full gradient-primary" />
            </div>
            <button className="mt-3 w-full rounded-lg border border-border-strong bg-background/40 py-1.5 text-xs font-medium text-foreground/90 transition hover:bg-background/70">
              Upgrade plan
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

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

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: FileText, label: "AI Job Generator", to: "/job-generator" },
  { icon: Users, label: "Candidate Analyzer", to: "/candidate-analyzer" },
  { icon: Bot, label: "Recruit Copilot", to: "/recruit-copilot", badge: "AI" },
  { icon: Mail, label: "Smart Emails", to: "/smart-emails" },
  { icon: BarChart3, label: "Analytics", to: "/analytics" },
  { icon: BookOpen, label: "Prompt Library", to: "/prompt-library" },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="relative grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight">RecruitAI OS</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Enterprise
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 px-3">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </div>
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = isActive(item.to);
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
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
                  <span className="flex-1 truncate text-left font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-md gradient-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-glow">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Account
        </div>
        <ul className="space-y-1">
          <li>
            <Link
              to="/settings"
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                isActive("/settings")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Settings
                className={`h-[18px] w-[18px] ${
                  isActive("/settings")
                    ? "text-primary"
                    : "text-sidebar-foreground/55 group-hover:text-primary"
                }`}
                strokeWidth={1.75}
              />
              <span className="font-medium">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4">
        <div className="glass-panel relative overflow-hidden rounded-2xl p-4">
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>AI Credits</span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">18,240</div>
            <div className="mt-1 text-[11px] text-muted-foreground">of 25,000 this month</div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
              <div className="h-full w-[72%] rounded-full gradient-primary" />
            </div>
            <button className="mt-4 w-full rounded-lg border border-border-strong bg-background/40 py-2 text-xs font-semibold text-foreground/90 transition hover:bg-background/70">
              Upgrade plan
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

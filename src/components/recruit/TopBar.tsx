import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, ChevronRight, Search, Sparkles } from "lucide-react";

const labels: Record<string, string> = {
  "": "Dashboard",
  "job-generator": "AI Job Generator",
  "candidate-analyzer": "Candidate Analyzer",
  "recruit-copilot": "Recruit Copilot",
  "smart-emails": "Smart Emails",
  "analytics": "Analytics",
  "prompt-library": "Prompt Library",
  "settings": "Settings",
};

export function TopBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);
  const current = segments.length === 0 ? "Dashboard" : labels[segments[0]] ?? segments[0];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/60 bg-background/70 px-6 backdrop-blur-xl">
      {/* Breadcrumbs */}
      <nav className="hidden md:flex items-center gap-1.5 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          RecruitAI OS
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
        <span className="font-medium text-foreground">{current}</span>
      </nav>

      {/* Global search */}
      <div className="ml-auto flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-3.5 py-2 text-sm text-muted-foreground transition focus-within:border-primary/60 focus-within:shadow-glow">
        <Search className="h-4 w-4" />
        <input
          type="text"
          placeholder="Search candidates, jobs, prompts…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5 text-[10px] font-medium">
          ⌘ K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative hidden md:grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white shadow-glow animate-pulse-glow">
          <Sparkles className="h-4 w-4" />
        </button>

        <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border-strong bg-surface/60 text-muted-foreground transition hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
        </button>

        <div className="ml-2 flex items-center gap-2.5 rounded-xl border border-border-strong bg-surface/60 px-2 py-1 pr-3 transition hover:bg-surface">
          <div className="grid h-7 w-7 place-items-center rounded-lg gradient-primary text-xs font-semibold text-white">
            AM
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-semibold">Alex Morán</div>
            <div className="text-[10px] text-muted-foreground">Head of Talent</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}

import { Bell, ChevronDown, Command, Sparkles } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/60 bg-background/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-foreground/80 font-medium">Workspace</span>
        <span>/</span>
        <span className="text-foreground">Dashboard</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="hidden md:flex items-center gap-2 rounded-lg border border-border-strong bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground">
          <Command className="h-3.5 w-3.5" />
          <span>Preguntar a Recruit AI…</span>
          <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
        </button>

        <button className="grid h-9 w-9 place-items-center rounded-lg border border-border-strong bg-surface/60 text-muted-foreground transition hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>

        <button className="relative grid h-9 w-9 place-items-center rounded-lg gradient-primary text-white shadow-glow animate-pulse-glow">
          <Sparkles className="h-4 w-4" />
        </button>

        <div className="ml-2 flex items-center gap-2 rounded-lg border border-border-strong bg-surface/60 px-2 py-1 pr-3">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-chart-2 text-xs font-semibold text-white">
            AM
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-xs font-medium">Alex Morán</div>
            <div className="text-[10px] text-muted-foreground">Head of Talent</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}

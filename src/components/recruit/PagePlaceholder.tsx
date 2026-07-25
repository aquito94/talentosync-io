import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface PagePlaceholderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  actions?: { label: string; primary?: boolean }[];
  cards?: { title: string; description: string; icon: LucideIcon }[];
}

export function PagePlaceholder({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions = [{ label: "Get started", primary: true }, { label: "View docs" }],
  cards = [],
}: PagePlaceholderProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 md:p-10 animate-float-up">
        <div className="absolute inset-0 opacity-70" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-background/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              {eyebrow}
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="gradient-text">{title}</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">{description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {actions.map((a) => (
                <button
                  key={a.label}
                  className={
                    a.primary
                      ? "rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
                      : "rounded-xl border border-border-strong bg-surface/60 px-4 py-2.5 text-sm font-semibold text-foreground/90 transition hover:bg-surface"
                  }
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative hidden md:grid h-28 w-28 shrink-0 place-items-center rounded-3xl gradient-primary shadow-glow">
            <Icon className="h-12 w-12 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Feature cards */}
      {cards.length > 0 && (
        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <article
              key={c.title}
              className="group glass-panel rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-glow animate-float-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-elevated text-primary transition group-hover:gradient-primary group-hover:text-white">
                <c.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-background/60">
                <div className="h-full w-1/3 rounded-full gradient-primary" />
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Empty state stub */}
      <section className="mt-8 rounded-2xl border border-dashed border-border-strong bg-surface/30 p-10 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-surface-elevated">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="mt-4 text-base font-semibold">Coming soon</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          This module's interface is ready. Interactive functionality will be enabled in the next iteration.
        </p>
      </section>
    </div>
  );
}

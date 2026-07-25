import { useState } from "react";
import { Mail, Send, Inbox, Star, Paperclip, Search, Sparkles, ChevronRight, Bot, Plus } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/smart-emails")({
  head: () => ({
    meta: [
      { title: "Smart Emails — RecruitAI OS" },
      { name: "description", content: "Personalized outreach at scale: sequences, replies and scheduling powered by candidate context." },
      { property: "og:title", content: "Smart Emails — RecruitAI OS" },
      { property: "og:description", content: "Personalized outreach at scale: sequences, replies and scheduling powered by candidate context." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartEmailsPage,
});

const folders = [
  { icon: Inbox, label: "Inbox", count: 12 },
  { icon: Star, label: "Starred", count: 4 },
  { icon: Send, label: "Sent", count: 128 },
  { icon: Bot, label: "AI drafts", count: 6 },
];

const emails = [
  { from: "Elena Ruiz", subject: "Re: Senior Frontend Engineer — Interview", preview: "Thanks Alex, Thursday 3pm works great for me. Looking forward…", when: "2m", unread: true, tag: "Interview" },
  { from: "David Chen", subject: "Interested in the role at RecruitAI OS", preview: "Hi Alex, saw your outreach — happy to jump on a call next week.", when: "1h", unread: true, tag: "Reply" },
  { from: "Talent Ops", subject: "Weekly pipeline digest", preview: "12 new applicants, 3 hires this week, avg time-to-hire 11 days.", when: "3h", tag: "Report" },
  { from: "Aisha Khan", subject: "Coffee chat next Tuesday?", preview: "Would love to learn more about the Staff role and the team.", when: "1d", tag: "Reply" },
  { from: "Mateo Silva", subject: "CV attached — Senior Backend", preview: "Please find my updated CV attached. Available for a chat.", when: "2d", tag: "New" },
];

function SmartEmailsPage() {
  const [openId, setOpenId] = useState(0);

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border/60 bg-sidebar/40 p-4">
          <button className="flex items-center justify-center gap-2 rounded-xl gradient-primary py-2.5 text-sm font-semibold text-white shadow-glow">
            <Plus className="h-4 w-4" /> Compose
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

          <div className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sequences</div>
          <ul className="mt-2 space-y-1 text-sm">
            {["Senior Engineers Q2", "Product Designers", "Sales Reactivation"].map((s) => (
              <li key={s}>
                <button className="w-full rounded-lg px-3 py-2 text-left text-xs text-muted-foreground hover:bg-surface/40 hover:text-foreground">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* List */}
        <div className="w-full max-w-md shrink-0 border-r border-border/60 lg:w-[380px]">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search inbox…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <ul className="overflow-y-auto">
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
          <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-sm font-semibold text-white shadow-glow">
              {emails[openId].from.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{emails[openId].subject}</div>
              <div className="text-xs text-muted-foreground">
                {emails[openId].from} · to Alex Morán · {emails[openId].when} ago
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="rounded-xl border border-border-strong bg-surface/60 px-3 py-1.5 text-xs">Reply</button>
              <button className="rounded-xl gradient-primary px-3 py-1.5 text-xs font-semibold text-white shadow-glow">
                <Sparkles className="mr-1 inline h-3 w-3" /> AI Reply
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 text-sm leading-relaxed text-foreground/90">
            <p>Hi Alex,</p>
            <p className="mt-3">
              Thanks for reaching out about the Senior Frontend Engineer role at RecruitAI OS — I've been following the product on Twitter and love the direction you're taking with the Copilot.
            </p>
            <p className="mt-3">
              Thursday at 3pm CET works great for me. Feel free to send over the calendar invite and any prep material you'd like me to review beforehand.
            </p>
            <p className="mt-3">Best,<br />Elena</p>
          </div>

          {/* AI Suggestion */}
          <div className="border-t border-border/60 p-4">
            <div className="glass-panel rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Bot className="h-4 w-4 text-primary" /> Copilot suggested reply
                <span className="ml-auto text-[10px] text-muted-foreground">Personalized · Warm</span>
              </div>
              <p className="mt-2 text-sm text-foreground/90">
                Perfect Elena — invite sent for Thursday 3pm CET. I've attached a short async prep doc with the roadmap and the team you'd be working with. Looking forward!
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button className="rounded-lg gradient-primary px-3 py-1.5 text-xs font-semibold text-white shadow-glow">
                  <Send className="mr-1 inline h-3 w-3" /> Send now
                </button>
                <button className="rounded-lg border border-border-strong bg-surface/60 px-3 py-1.5 text-xs">Edit</button>
                <button className="rounded-lg border border-border-strong bg-surface/60 px-3 py-1.5 text-xs">
                  <Paperclip className="mr-1 inline h-3 w-3" /> Attach
                </button>
                <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
                  Regenerate <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

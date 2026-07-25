import { useState } from "react";
import { Bot, Send, Sparkles, Plus, MessageSquare, Wand2, FileText, Users, Calendar, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recruit-copilot")({
  head: () => ({
    meta: [
      { title: "Recruit Copilot — RecruitAI OS" },
      { name: "description", content: "Your always-on AI recruiting partner: drafts, decisions and next-best-actions across your pipeline." },
      { property: "og:title", content: "Recruit Copilot — RecruitAI OS" },
      { property: "og:description", content: "Your always-on AI recruiting partner: drafts, decisions and next-best-actions across your pipeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CopilotPage,
});

const conversations = [
  { title: "Screening — Senior Backend", when: "2m ago", active: true },
  { title: "Outreach for Product Designer", when: "1h ago" },
  { title: "Compare 3 Data Scientists", when: "Yesterday" },
  { title: "Rewrite JD — Growth Lead", when: "2d ago" },
];

const suggestions = [
  { icon: FileText, label: "Draft outreach for top 5 matches" },
  { icon: Users, label: "Compare shortlisted candidates" },
  { icon: Calendar, label: "Schedule 3 interviews next week" },
  { icon: Wand2, label: "Rewrite this JD to be more inclusive" },
];

function CopilotPage() {
  const [input, setInput] = useState("");

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversations */}
        <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-border/60 bg-sidebar/40 p-4">
          <button className="flex items-center justify-center gap-2 rounded-xl gradient-primary py-2.5 text-sm font-semibold text-white shadow-glow">
            <Plus className="h-4 w-4" /> New conversation
          </button>
          <div className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">History</div>
          <ul className="mt-2 space-y-1 overflow-y-auto">
            {conversations.map((c, i) => (
              <li key={i}>
                <button className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${c.active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-surface/40 hover:text-foreground"}`}>
                  <MessageSquare className="mt-0.5 h-4 w-4 text-primary/70" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{c.title}</div>
                    <div className="text-[10px] text-muted-foreground">{c.when}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">Recruit Copilot</div>
              <div className="text-[11px] text-muted-foreground">Powered by RecruitAI · GPT-Enterprise</div>
            </div>
            <div className="ml-auto flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-[11px] font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" /> Online
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto max-w-3xl space-y-6">
              <ChatBubble from="user" text="Give me a shortlist of the top 5 candidates for the Senior Frontend role in Madrid, and draft a first outreach email." />
              <ChatBubble from="ai">
                <p>Here are the 5 highest-scoring candidates for that role:</p>
                <ul className="mt-3 space-y-2">
                  {["Elena Ruiz — 96", "David Chen — 92", "Aisha Khan — 89", "Mateo Silva — 84", "Nina Larsson — 78"].map((c) => (
                    <li key={c} className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/40 px-3 py-2 text-sm">
                      <span className="grid h-6 w-6 place-items-center rounded-md gradient-primary text-[10px] font-semibold text-white">{c.split(" ")[0][0]}</span>
                      <span className="flex-1">{c}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </li>
                  ))}
                </ul>
                <p className="mt-4">Draft outreach ready — shall I send it via Smart Emails?</p>
              </ChatBubble>
              <ChatBubble from="user" text="Yes, and schedule intro calls for anyone who replies within 24h." />
              <ChatBubble from="ai" typing />
            </div>
          </div>

          {/* Suggestions + Composer */}
          <div className="border-t border-border/60 px-6 py-4">
            <div className="mx-auto max-w-3xl">
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s.label} className="flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition">
                    <s.icon className="h-3.5 w-3.5 text-primary" /> {s.label}
                  </button>
                ))}
              </div>
              <div className="flex items-end gap-2 rounded-2xl border border-border-strong bg-surface/60 p-2 focus-within:border-primary/60 focus-within:shadow-glow transition">
                <Sparkles className="ml-2 mb-2 h-4 w-4 text-primary" />
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={1}
                  placeholder="Ask Copilot anything about your pipeline…"
                  className="flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white shadow-glow">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ChatBubble({ from, text, children, typing }: { from: "user" | "ai"; text?: string; children?: React.ReactNode; typing?: boolean }) {
  const isUser = from === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-semibold ${isUser ? "bg-surface-elevated text-foreground" : "gradient-primary text-white shadow-glow"}`}>
        {isUser ? "AM" : <Bot className="h-4 w-4" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? "bg-primary/15 text-foreground" : "glass-panel"}`}>
        {typing ? (
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="h-2 w-2 rounded-full bg-primary/70 animate-pulse-glow" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 rounded-full bg-primary/40 animate-pulse-glow" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          text ?? children
        )}
      </div>
    </div>
  );
}

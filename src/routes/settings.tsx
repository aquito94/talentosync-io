import { useState } from "react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";
import { User, Building2, KeyRound, Bell, CreditCard, Plug, Check, Shield } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — RecruitAI OS" },
      { name: "description", content: "Manage your workspace, team access, integrations and enterprise security controls." },
      { property: "og:title", content: "Settings — RecruitAI OS" },
      { property: "og:description", content: "Manage your workspace, team access, integrations and enterprise security controls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const tabs = [
  { icon: User, label: "Profile" },
  { icon: Building2, label: "Organization" },
  { icon: Plug, label: "Integrations" },
  { icon: KeyRound, label: "Security" },
  { icon: Bell, label: "Notifications" },
  { icon: CreditCard, label: "Billing" },
];

const integrations = [
  { name: "Slack", desc: "Send pipeline updates and copilot digests.", connected: true },
  { name: "Google Workspace", desc: "Calendar, Gmail and Drive sync.", connected: true },
  { name: "Greenhouse", desc: "Bi-directional ATS sync.", connected: true },
  { name: "Lever", desc: "Import jobs and candidates.", connected: false },
  { name: "LinkedIn Recruiter", desc: "Enrich profiles and outreach.", connected: false },
  { name: "Workday", desc: "Enterprise HRIS integration.", connected: false },
];

function SettingsPage() {
  const [active, setActive] = useState("Profile");

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="animate-float-up">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your workspace, security and integrations.</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="glass-panel h-fit rounded-2xl p-2">
            <ul className="space-y-0.5">
              {tabs.map((t) => (
                <li key={t.label}>
                  <button
                    onClick={() => setActive(t.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active === t.label ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-surface/40 hover:text-foreground"}`}
                  >
                    <t.icon className="h-4 w-4" />
                    <span className="font-medium">{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="glass-panel rounded-2xl p-8">
            {active === "Profile" && <ProfilePanel />}
            {active === "Organization" && <OrgPanel />}
            {active === "Integrations" && <IntegrationsPanel />}
            {active === "Security" && <SecurityPanel />}
            {active === "Notifications" && <NotificationsPanel />}
            {active === "Billing" && <BillingPanel />}
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function ProfilePanel() {
  return (
    <>
      <h2 className="text-lg font-semibold">Profile</h2>
      <p className="text-xs text-muted-foreground">Update your personal information.</p>

      <div className="mt-6 flex items-center gap-5">
        <div className="grid h-20 w-20 place-items-center rounded-2xl gradient-primary text-lg font-semibold text-white shadow-glow">AM</div>
        <div>
          <button className="rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-xs">Upload photo</button>
          <p className="mt-2 text-[11px] text-muted-foreground">PNG or JPG · max 2MB</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Input label="Full name" value="Alex Morán" />
        <Input label="Email" value="alex@recruitai.com" />
        <Input label="Job title" value="Head of Talent" />
        <Input label="Timezone" value="Europe/Madrid" />
      </div>

      <div className="mt-8 flex justify-end gap-2 border-t border-border/60 pt-6">
        <button className="rounded-xl border border-border-strong bg-surface/60 px-4 py-2 text-sm">Cancel</button>
        <button className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow">Save changes</button>
      </div>
    </>
  );
}

function OrgPanel() {
  return (
    <>
      <h2 className="text-lg font-semibold">Organization</h2>
      <p className="text-xs text-muted-foreground">Configure your company workspace.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label="Company name" value="RecruitAI OS" />
        <Input label="Website" value="recruitai.com" />
        <Input label="Industry" value="Enterprise SaaS" />
        <Input label="Team size" value="120" />
      </div>
    </>
  );
}

function IntegrationsPanel() {
  return (
    <>
      <h2 className="text-lg font-semibold">Integrations</h2>
      <p className="text-xs text-muted-foreground">Connect the tools your team already loves.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {integrations.map((i) => (
          <div key={i.name} className="flex items-center gap-4 rounded-2xl border border-border-strong bg-surface/40 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-elevated text-primary">
              <Plug className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{i.name}</span>
                {i.connected && <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">Connected</span>}
              </div>
              <p className="text-[11px] text-muted-foreground">{i.desc}</p>
            </div>
            <button className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${i.connected ? "border border-border-strong bg-surface/60 text-foreground" : "gradient-primary text-white shadow-glow"}`}>
              {i.connected ? "Manage" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function SecurityPanel() {
  return (
    <>
      <h2 className="text-lg font-semibold">Security</h2>
      <p className="text-xs text-muted-foreground">Protect your workspace with enterprise-grade controls.</p>
      <div className="mt-6 space-y-3">
        {[
          { icon: Shield, label: "Two-factor authentication", desc: "Required for all admins", on: true },
          { icon: KeyRound, label: "SSO (SAML 2.0)", desc: "Okta · connected", on: true },
          { icon: Check, label: "SCIM provisioning", desc: "Automated user lifecycle", on: false },
          { icon: Shield, label: "Audit log streaming", desc: "Push to Datadog", on: true },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-4 rounded-2xl border border-border-strong bg-surface/40 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-elevated text-primary">
              <r.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{r.label}</div>
              <div className="text-[11px] text-muted-foreground">{r.desc}</div>
            </div>
            <Toggle on={r.on} />
          </div>
        ))}
      </div>
    </>
  );
}

function NotificationsPanel() {
  return (
    <>
      <h2 className="text-lg font-semibold">Notifications</h2>
      <p className="text-xs text-muted-foreground">Choose what lands in your inbox.</p>
      <div className="mt-6 space-y-3">
        {["New candidate matches", "Copilot suggestions", "Interview scheduled", "Weekly digest", "Product updates"].map((n, i) => (
          <div key={n} className="flex items-center justify-between rounded-2xl border border-border-strong bg-surface/40 p-4">
            <div className="text-sm">{n}</div>
            <Toggle on={i < 3} />
          </div>
        ))}
      </div>
    </>
  );
}

function BillingPanel() {
  return (
    <>
      <h2 className="text-lg font-semibold">Billing</h2>
      <p className="text-xs text-muted-foreground">Your plan, seats and invoices.</p>
      <div className="mt-6 rounded-2xl border border-border-strong bg-surface/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Current plan</div>
            <div className="mt-1 text-xl font-semibold gradient-text">Enterprise</div>
            <div className="text-xs text-muted-foreground">120 seats · billed annually</div>
          </div>
          <button className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow">Manage plan</button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <BillStat label="Seats used" value="98 / 120" />
          <BillStat label="AI credits" value="18,240 / 25,000" />
          <BillStat label="Next invoice" value="Jan 1, 2027" />
        </div>
      </div>
    </>
  );
}

function Input({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input defaultValue={value} className="mt-1.5 w-full rounded-xl border border-border-strong bg-surface/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:shadow-glow transition" />
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  const [v, setV] = useState(on);
  return (
    <button
      onClick={() => setV(!v)}
      className={`relative h-6 w-11 rounded-full transition ${v ? "gradient-primary shadow-glow" : "bg-surface-elevated"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${v ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function BillStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-strong bg-background/40 p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

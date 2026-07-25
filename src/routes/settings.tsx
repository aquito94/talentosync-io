import { useState } from "react";
import { AppShell } from "@/components/recruit/AppShell";
import { createFileRoute } from "@tanstack/react-router";
import { User, Building2, KeyRound, Bell, CreditCard, Plug, Check, Shield } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configuración — RecruitAI OS" },
      { name: "description", content: "Gestiona tu espacio de trabajo, accesos del equipo, integraciones y controles de seguridad empresarial." },
      { property: "og:title", content: "Configuración — RecruitAI OS" },
      { property: "og:description", content: "Gestiona tu espacio de trabajo, accesos del equipo, integraciones y controles de seguridad empresarial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const tabs = [
  { icon: User, label: "Perfil" },
  { icon: Building2, label: "Organización" },
  { icon: Plug, label: "Integraciones" },
  { icon: KeyRound, label: "Seguridad" },
  { icon: Bell, label: "Notificaciones" },
  { icon: CreditCard, label: "Facturación" },
];

const integrations = [
  { name: "Slack", desc: "Envía actualizaciones del pipeline y resúmenes del copiloto.", connected: true },
  { name: "Google Workspace", desc: "Sincronización con Calendar, Gmail y Drive.", connected: true },
  { name: "Greenhouse", desc: "Sincronización bidireccional con el ATS.", connected: true },
  { name: "Lever", desc: "Importa vacantes y candidatos.", connected: false },
  { name: "LinkedIn Recruiter", desc: "Enriquecimiento de perfiles y contacto.", connected: false },
  { name: "Workday", desc: "Integración empresarial con HRIS.", connected: false },
];

function SettingsPage() {
  const [active, setActive] = useState("Perfil");

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="animate-float-up">
          <h1 className="text-3xl font-semibold tracking-tight">Configuración</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestiona tu espacio de trabajo, la seguridad y las integraciones.</p>
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
            {active === "Perfil" && <ProfilePanel />}
            {active === "Organización" && <OrgPanel />}
            {active === "Integraciones" && <IntegrationsPanel />}
            {active === "Seguridad" && <SecurityPanel />}
            {active === "Notificaciones" && <NotificationsPanel />}
            {active === "Facturación" && <BillingPanel />}
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function ProfilePanel() {
  return (
    <>
      <h2 className="text-lg font-semibold">Perfil</h2>
      <p className="text-xs text-muted-foreground">Actualiza tu información personal.</p>

      <div className="mt-6 flex items-center gap-5">
        <div className="grid h-20 w-20 place-items-center rounded-2xl gradient-primary text-lg font-semibold text-white shadow-glow">ÁM</div>
        <div>
          <button className="rounded-xl border border-border-strong bg-surface/60 px-3 py-2 text-xs">Subir foto</button>
          <p className="mt-2 text-[11px] text-muted-foreground">PNG o JPG · máx 2 MB</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Input label="Nombre completo" value="Álvaro Morán" />
        <Input label="Correo electrónico" value="alvaro@recruitai.com" />
        <Input label="Cargo" value="Director de Talento" />
        <Input label="Zona horaria" value="Europe/Madrid" />
      </div>

      <div className="mt-8 flex justify-end gap-2 border-t border-border/60 pt-6">
        <button className="rounded-xl border border-border-strong bg-surface/60 px-4 py-2 text-sm">Cancelar</button>
        <button className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow">Guardar cambios</button>
      </div>
    </>
  );
}

function OrgPanel() {
  return (
    <>
      <h2 className="text-lg font-semibold">Organización</h2>
      <p className="text-xs text-muted-foreground">Configura el espacio de trabajo de tu empresa.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label="Nombre de la empresa" value="RecruitAI OS" />
        <Input label="Sitio web" value="recruitai.com" />
        <Input label="Industria" value="SaaS empresarial" />
        <Input label="Tamaño del equipo" value="120" />
      </div>
    </>
  );
}

function IntegrationsPanel() {
  return (
    <>
      <h2 className="text-lg font-semibold">Integraciones</h2>
      <p className="text-xs text-muted-foreground">Conecta las herramientas que tu equipo ya utiliza.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {integrations.map((i) => (
          <div key={i.name} className="flex items-center gap-4 rounded-2xl border border-border-strong bg-surface/40 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-elevated text-primary">
              <Plug className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{i.name}</span>
                {i.connected && <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">Conectado</span>}
              </div>
              <p className="text-[11px] text-muted-foreground">{i.desc}</p>
            </div>
            <button className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${i.connected ? "border border-border-strong bg-surface/60 text-foreground" : "gradient-primary text-white shadow-glow"}`}>
              {i.connected ? "Gestionar" : "Conectar"}
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
      <h2 className="text-lg font-semibold">Seguridad</h2>
      <p className="text-xs text-muted-foreground">Protege tu espacio de trabajo con controles de nivel empresarial.</p>
      <div className="mt-6 space-y-3">
        {[
          { icon: Shield, label: "Autenticación en dos pasos", desc: "Obligatoria para todos los administradores", on: true },
          { icon: KeyRound, label: "Inicio de sesión único (SAML 2.0)", desc: "Okta · conectado", on: true },
          { icon: Check, label: "Aprovisionamiento SCIM", desc: "Ciclo de vida de usuarios automatizado", on: false },
          { icon: Shield, label: "Envío de registros de auditoría", desc: "Enviar a Datadog", on: true },
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
      <h2 className="text-lg font-semibold">Notificaciones</h2>
      <p className="text-xs text-muted-foreground">Elige qué llega a tu bandeja de entrada.</p>
      <div className="mt-6 space-y-3">
        {["Nuevas coincidencias de candidatos", "Sugerencias del Copiloto", "Entrevista agendada", "Resumen semanal", "Actualizaciones de producto"].map((n, i) => (
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
      <h2 className="text-lg font-semibold">Facturación</h2>
      <p className="text-xs text-muted-foreground">Tu plan, licencias y facturas.</p>
      <div className="mt-6 rounded-2xl border border-border-strong bg-surface/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Plan actual</div>
            <div className="mt-1 text-xl font-semibold gradient-text">Empresa</div>
            <div className="text-xs text-muted-foreground">120 licencias · facturación anual</div>
          </div>
          <button className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow">Gestionar plan</button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <BillStat label="Licencias en uso" value="98 / 120" />
          <BillStat label="Créditos de IA" value="18.240 / 25.000" />
          <BillStat label="Próxima factura" value="1 ene 2027" />
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

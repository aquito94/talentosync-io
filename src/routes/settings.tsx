import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, User, Building2, KeyRound } from "lucide-react";
import { AppShell } from "@/components/recruit/AppShell";
import { PagePlaceholder } from "@/components/recruit/PagePlaceholder";

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
  component: () => (
    <AppShell>
      <PagePlaceholder
        icon={SettingsIcon}
        eyebrow="Workspace"
        title="Settings"
        description="Configure your workspace, roles, integrations and security policies. Everything an enterprise admin needs."
        cards={[
          { title: "Profile & preferences", description: "Personalize your workspace and notifications.", icon: User },
          { title: "Organization", description: "Teams, SSO domains and billing seats.", icon: Building2 },
          { title: "Security", description: "SAML, SCIM, audit logs and API keys.", icon: KeyRound },
        ]}
      />
    </AppShell>
  ),
});

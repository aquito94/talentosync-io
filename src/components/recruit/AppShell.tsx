import { createContext, useContext, useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

type ShellCtx = { mobileOpen: boolean; setMobileOpen: (v: boolean) => void };
const ShellContext = createContext<ShellCtx | null>(null);

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used inside <AppShell>");
  return ctx;
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <ShellContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

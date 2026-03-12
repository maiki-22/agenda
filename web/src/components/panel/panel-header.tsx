"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { supabaseBrowser } from "@/lib/supabase/client";

type PanelRole = "admin" | "barber";

interface PanelHeaderProps {
  role: PanelRole;
}

const ROLE_LABEL: Record<PanelRole, string> = {
  admin: "Admin",
  barber: "Barbero",
};

export function PanelHeader({ role }: PanelHeaderProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut(): Promise<void> {
    if (isSigningOut) {
      return;
    }

    setSignOutError(null);
    setIsSigningOut(true);

    const { error } = await supabaseBrowser.auth.signOut();

    if (error) {
      setSignOutError("No pudimos cerrar tu sesión. Inténtalo nuevamente.");
      setIsSigningOut(false);
      return;
    }

    router.refresh();
    router.push("/panel/login");
  }

  return (
     <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/90 backdrop-blur-md sm:static">
      <div className="page-container flex items-center justify-between gap-3 pb-3 pt-[calc(env(safe-area-inset-top)+12px)]">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-center">
            <span className="truncate font-semibold leading-tight text-[rgb(var(--fg))]">
              La Sucursal
            </span>
            <span className="text-xs leading-tight text-[rgb(var(--muted))]">
              Panel interno
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex h-8 items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 text-xs font-medium text-[rgb(var(--fg))] sm:h-9 sm:text-sm">
            {ROLE_LABEL[role]}
          </span>

          <ThemeToggle />

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleSignOut}
            disabled={isSigningOut}
            aria-label="Cerrar sesión"
            className="px-2.5 sm:px-4"
          >
            <span className="hidden sm:inline">
              {isSigningOut ? "Cerrando..." : "Cerrar sesión"}
            </span>
            <span className="sm:hidden" aria-hidden="true">
              ↪
            </span>
          </Button>
        </div>
      </div>

      {signOutError ? (
        <p
          className="page-container mt-2 text-sm text-[rgb(var(--muted))]"
          role="status"
          aria-live="polite"
        >
          {signOutError}
        </p>
      ) : null}
    </header>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LogoAdaptive from "@/components/ui/LogoAdaptative";
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
    <header className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-3 shadow-[var(--shadow-soft)] sm:px-5 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold sm:text-base">
              La Sucursal Barber Shop
            </p>
            <p className="hidden text-xs text-[rgb(var(--muted))] sm:block">
              Panel interno
            </p>
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
          className="mt-2 text-sm text-red-500"
          role="status"
          aria-live="polite"
        >
          {signOutError}
        </p>
      ) : null}
    </header>
  );
}

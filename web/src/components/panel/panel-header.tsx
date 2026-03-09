import ThemeToggle from "@/components/theme/ThemeToggle";
import { PanelSignOutButton } from "@/components/panel/panel-sign-out-button";

type PanelHeaderRole = "admin" | "barber";

interface PanelHeaderProps {
  userEmail: string;
  role: PanelHeaderRole;
}

const ROLE_LABEL: Record<PanelHeaderRole, string> = {
  admin: "Admin",
  barber: "Barbero",
};

export function PanelHeader({ userEmail, role }: PanelHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/90 backdrop-blur-md">
      <div className="page-container pt-[calc(env(safe-area-inset-top)+12px)] pb-3 flex flex-wrap items-center gap-3 sm:flex-nowrap">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--fg))]">
            La Sucursal
          </span>
          <span className="flex items-center gap-1.5 opacity-40">
            <span className="block h-px w-6 bg-current" />
            <span className="text-[8px] font-medium uppercase tracking-[0.3em]">
              Barber Shop
            </span>
            <span className="block h-px w-6 bg-current" />
          </span>
        </div>

        <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto">
          <div className="min-w-0 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-right">
            <p className="truncate text-xs text-[rgb(var(--muted))]">{userEmail}</p>
            <p className="text-xs font-semibold text-[rgb(var(--fg))]">
              <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] px-2 py-0.5">
                {ROLE_LABEL[role]}
              </span>
            </p>
          </div>

          <ThemeToggle />
          <PanelSignOutButton />
        </div>
      </div>
    </header>
  );
}
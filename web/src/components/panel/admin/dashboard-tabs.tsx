"use client";

const TAB_ITEMS = [
  { key: "summary", label: "Resumen" },
  { key: "bookings", label: "Reservas" },
  { key: "operations", label: "Operaciones" },
] as const;

export type DashboardTabKey = (typeof TAB_ITEMS)[number]["key"];

interface DashboardTabsProps {
  activeTab: DashboardTabKey;
  onChange: (tab: DashboardTabKey) => void;
}

export function DashboardTabs({ activeTab, onChange }: DashboardTabsProps) {
  return (
    <>
      <nav
        aria-label="Secciones del panel"
        className="hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-1.5 shadow-[var(--shadow-soft)] sm:block"
      >
        <ul className="grid grid-cols-3 gap-1">
          {TAB_ITEMS.map((tab) => (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onChange(tab.key)}
                aria-current={activeTab === tab.key ? "page" : undefined}
                className={[
                  "w-full rounded-2xl px-3 py-2 text-xs sm:text-sm font-medium transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))]",
                  activeTab === tab.key
                    ? "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))]"
                    : "bg-transparent text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        aria-label="Navegación rápida del panel"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]/95 px-3 py-2 backdrop-blur sm:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {TAB_ITEMS.map((tab) => (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onChange(tab.key)}
                aria-current={activeTab === tab.key ? "page" : undefined}
                className={[
                  "w-full rounded-xl px-2 py-2 text-xs font-medium transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))]",
                  activeTab === tab.key
                    ? "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))]"
                    : "text-[rgb(var(--muted))]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

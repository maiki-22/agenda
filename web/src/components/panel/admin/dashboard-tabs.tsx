"use client";

const TAB_ITEMS = [
  {
    key: "summary",
    label: "Resumen",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M4 5h7v6H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 13h7v6H4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "bookings",
    label: "Reservas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "operations",
    label: "Operaciones",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M10 6 7 9l3 3M14 18l3-3-3-3M8 17h8M8 7h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export type DashboardTabKey = (typeof TAB_ITEMS)[number]["key"];

interface DashboardTabsProps {
  activeTab: DashboardTabKey;
  onChange: (tab: DashboardTabKey) => void;
}

export function DashboardTabs({ activeTab, onChange }: DashboardTabsProps) {
  return (
    <>
      <nav aria-label="Secciones del panel" className="hidden border-b border-[rgb(var(--border))] sm:block">
        <ul className="flex items-center gap-6">
          {TAB_ITEMS.map((tab) => (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onChange(tab.key)}
                aria-current={activeTab === tab.key ? "page" : undefined}
                className={`relative min-h-11 px-1 pb-3 pt-2 text-sm font-normal transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] ${
                  activeTab === tab.key
                                      ? "text-[rgb(var(--primary))]"
                    : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 transition-all duration-150 ease-out ${
                    activeTab === tab.key
                      ? "bg-[rgb(var(--primary))]"
                      : "bg-transparent"
                  }`}
                  aria-hidden="true"
                />
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
               className={`flex min-h-11 w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-xs font-normal transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] ${
                  activeTab === tab.key
                  ? "text-[rgb(var(--primary))]"
                    : "text-[rgb(var(--muted))]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

"use client";

import { getPanelNavItems } from "@/components/panel/navigation/nav-config";

const TAB_ITEMS = getPanelNavItems("admin");

export type DashboardTabKey = (typeof TAB_ITEMS)[number]["key"];

interface DashboardTabsProps {
  activeTab: DashboardTabKey;
  onChange: (tab: DashboardTabKey) => void;
}

export function DashboardTabs({ activeTab, onChange }: DashboardTabsProps) {
  return (
    <>
      {/* Desktop Navigation */}
      <nav
        aria-label="Secciones del panel administrador"
        className="hidden border-b border-[rgb(var(--border))] sm:block"
      >
        <ul className="flex items-center gap-6">
          {TAB_ITEMS.map((tab) => (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onChange(tab.key)}
                aria-current={activeTab === tab.key ? "page" : undefined}
                aria-label={tab.ariaLabel}
                className={`relative min-h-11 px-1 pb-3 pt-2 text-sm font-normal transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] ${
                  activeTab === tab.key
                    ? "text-[rgb(var(--primary))]"
                    : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-150 ease-out ${
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

      {/* Mobile Navigation (Bottom Bar) */}
      <nav
        aria-label="Navegación rápida del panel administrador"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]/95 px-3 py-2 backdrop-blur sm:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {TAB_ITEMS.map((tab) => (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onChange(tab.key)}
                aria-current={activeTab === tab.key ? "page" : undefined}
                aria-label={tab.ariaLabel}
                className={`flex min-h-11 w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-xs font-normal transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] ${
                  activeTab === tab.key
                    ? "text-[rgb(var(--primary))]"
                    : "text-[rgb(var(--muted))]"
                }`}
              >
                <svg
                  viewBox={tab.icon.viewBox}
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d={tab.icon.path}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

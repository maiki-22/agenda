"use client";

import type { ReactNode } from "react";

interface CollapsiblePanelCardProps {
  title: string;
  description: string;
  primaryActionLabel: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsiblePanelCard({
  title,
  description,
  primaryActionLabel,
  children,
  defaultOpen = false,
}: CollapsiblePanelCardProps) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] shadow-[var(--shadow-soft)]"
    >
      <summary className="list-none cursor-pointer p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-[rgb(var(--muted))] mt-1">
              {description}
            </p>
          </div>
          <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-2.5 py-1 text-[11px] font-medium text-[rgb(var(--muted))]">
            {primaryActionLabel}
          </span>
        </div>
      </summary>
      <div className="border-t border-[rgb(var(--border))] p-4 sm:p-5">
        {children}
      </div>
    </details>
  );
}

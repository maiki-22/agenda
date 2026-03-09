import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 transition-all duration-150 ease-out hover:border-[rgb(var(--primary-glow))] hover:brightness-105">
      <div className="flex items-center gap-2 text-[rgb(var(--muted))]">
        {icon ? (
          <span className="h-4 w-4" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <p className="text-xs font-normal uppercase tracking-widest">{label}</p>
      </div>
      <p className="mt-3 text-4xl font-bold leading-none">{value}</p>
    </article>
  );
}
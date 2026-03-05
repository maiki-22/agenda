interface StatCardProps {
  label: string;
  value: number | string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-3.5 sm:p-4 shadow-[var(--shadow-soft)]">
      <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--muted))]">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </article>
  );
}
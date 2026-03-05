import { StatCard } from "./stat-card";
import type { OverviewResponse } from "@/types/panel";

interface OverviewSummaryProps {
  overview: OverviewResponse | null;
}

export function OverviewSummary({ overview }: OverviewSummaryProps) {
  return (
    <section className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Total citas" value={overview?.totals.total ?? 0} />
      <StatCard label="Confirmadas" value={overview?.totals.confirmed ?? 0} />
      <StatCard label="Pendientes" value={overview?.totals.pending ?? 0} />
      <StatCard label="Canceladas" value={overview?.totals.cancelled ?? 0} />
      <StatCard label="Tasa confirmación" value={`${overview?.rates.confirmation_rate ?? 0}%`} />
      <StatCard label="Tasa cancelación" value={`${overview?.rates.cancellation_rate ?? 0}%`} />
    </section>
  );
}
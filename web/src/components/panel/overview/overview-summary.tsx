import { Button } from "@/components/ui/Button";
import { StatCard } from "./stat-card";
import type { OverviewResponse } from "@/types/panel";

interface OverviewSummaryProps {
  overview: OverviewResponse | null;
  error: string;
  onRetry: () => Promise<void>;
}

export function OverviewSummary({
  overview,
  error,
  onRetry,
}: OverviewSummaryProps) {
  if (error) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
        <h2 className="font-semibold">No se pudo cargar el resumen</h2>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">{error}</p>
        <Button className="mt-3" variant="secondary" onClick={onRetry}>
          Reintentar resumen
        </Button>
      </section>
    );
  }

  if (!overview) {
    return (
      <section className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
        <p className="text-sm text-[rgb(var(--muted))]">
          Aún no hay datos para mostrar en el resumen.
        </p>
        <Button className="mt-3" variant="secondary" onClick={onRetry}>
          Reintentar carga
        </Button>
      </section>
    );
  }
  return (
    <section className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Total citas" value={overview.totals.total} />
      <StatCard label="Confirmadas" value={overview.totals.confirmed} />
      <StatCard label="Pendientes" value={overview.totals.pending} />
      <StatCard label="Canceladas" value={overview.totals.cancelled} />
      <StatCard label="Tasa confirmación" value={`${overview.rates.confirmation_rate}%`} />
      <StatCard label="Tasa cancelación" value={`${overview.rates.cancellation_rate}%`} />
    </section>
  );
}
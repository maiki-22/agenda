import type { OverviewResponse } from "@/types/panel";

interface OverviewBreakdownProps {
  overview: OverviewResponse | null;
  onToggleBarberStatus: (barberId: string, active: boolean) => Promise<void>;
}

export function OverviewBreakdown({ overview, onToggleBarberStatus }: OverviewBreakdownProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-5">
      <article className="xl:col-span-3 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-semibold mb-3">Citas por día</h2>
        <div className="space-y-2">
          {(overview?.by_date ?? []).slice(0, 10).map((row) => {
            const width = overview?.totals.total ? Math.max(6, Math.round((row.total / overview.totals.total) * 100)) : 0;
            return (
              <div key={row.date} className="grid grid-cols-[90px_1fr_40px] gap-2 items-center text-xs sm:text-sm">
                <span className="text-[rgb(var(--muted))]">{row.date.slice(5)}</span>
                <div className="h-2.5 rounded-full bg-[rgb(var(--surface))] overflow-hidden">
                  <div className="h-full rounded-full bg-[rgb(var(--primary))]" style={{ width: `${width}%` }} />
                </div>
                <span className="text-right font-medium">{row.total}</span>
              </div>
            );
          })}
        </div>
      </article>

      <section className="xl:col-span-2 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-semibold mb-3">Desempeño por barbero</h2>
        <div className="space-y-2">
          {(overview?.by_barber ?? []).map((row) => {
            const barber = overview?.barbers.find((item) => item.id === row.barber_id);
            return (
              <article key={row.barber_id} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{row.barber_name}</p>
                  <button
                    onClick={() => (barber ? onToggleBarberStatus(barber.id, !barber.active) : Promise.resolve())}
                    className="rounded-xl border border-[rgb(var(--border))] px-2.5 py-1.5 text-xs"
                  >
                    {barber?.active ? "Deshabilitar" : "Habilitar"}
                  </button>
                </div>
                <p className="text-xs text-[rgb(var(--muted))] mt-2">Total {row.total} · Confirmadas {row.confirmed} · Pendientes {row.pending}</p>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
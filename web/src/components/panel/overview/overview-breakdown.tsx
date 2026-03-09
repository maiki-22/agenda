import { Button } from "@/components/ui/Button";
import type { OverviewResponse } from "@/types/panel";
import { formatDateShortCL } from "@/lib/datetime/ui-date-format";

interface OverviewBreakdownProps {
  overview: OverviewResponse | null;
  error: string;
  onRetry: () => Promise<void>;
  onToggleBarberStatus: (
    barberId: string,
    active: boolean,
  ) => Promise<string | null>;
  onFeedback: (message: string, type: "success" | "error") => void;
}

export function OverviewBreakdown({
  overview,
  error,
  onRetry,
  onToggleBarberStatus,
  onFeedback,
}: OverviewBreakdownProps) {
  if (error) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
        <h2 className="font-semibold">No se pudo cargar el desglose</h2>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">{error}</p>
        <Button className="mt-3" variant="secondary" onClick={onRetry}>
          Reintentar desglose
        </Button>
      </section>
    );
  }

  if (!overview || overview.by_date.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
        <p className="text-sm text-[rgb(var(--muted))]">
          No hay citas registradas en esta ventana para mostrar el desglose.
        </p>
        <Button className="mt-3" variant="secondary" onClick={onRetry}>
          Reintentar carga
        </Button>
      </section>
    );
  }

  return (
    <section className="grid gap-4 xl:grid-cols-5">
      <article className="xl:col-span-3 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-semibold mb-3">Citas por día</h2>
        <div className="space-y-2">
                    {overview.by_date.slice(0, 10).map((row) => {
            const width = overview.totals.total
              ? Math.max(6, Math.round((row.total / overview.totals.total) * 100))
              : 0;
            return (
              <div
                key={row.date}
                className="grid grid-cols-[90px_1fr_40px] gap-2 items-center text-xs sm:text-sm"
              >
                <span className="text-[rgb(var(--muted))]">
                  {formatDateShortCL(row.date)}
                </span>
                <div className="h-2.5 rounded-full bg-[rgb(var(--surface))] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[rgb(var(--primary))]"
                    style={{ width: `${width}%` }}
                  />
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
          {overview.by_barber.map((row) => {
            const barber = overview.barbers.find((item) => item.id === row.barber_id);
            return (
              <article
                key={row.barber_id}
                className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{row.barber_name}</p>
                  <button
                    onClick={async () => {
                      if (!barber) return;
                      const active = !barber.active;
                      const action = active ? "habilitar" : "deshabilitar";
                      const mutationError = await onToggleBarberStatus(barber.id, active);
                      if (mutationError) {
                        onFeedback(`No se pudo ${action} el barbero: ${mutationError}`, "error");
                        return;
                      }
                      onFeedback(`Barbero ${active ? "habilitado" : "deshabilitado"} correctamente`, "success");
                    }}
                    className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-2.5 py-1.5 text-xs transition hover:border-[rgb(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))]"
                    aria-label={`${barber?.active ? "Deshabilitar" : "Habilitar"} a ${row.barber_name}`}
                  >
                    {barber?.active ? "Deshabilitar" : "Habilitar"}
                  </button>
                </div>
                <p className="text-xs text-[rgb(var(--muted))] mt-2">
                  Total {row.total} · Confirmadas {row.confirmed} · Pendientes{" "}
                  {row.pending}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}

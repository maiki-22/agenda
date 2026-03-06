import type { Barber, WindowOption } from "@/types/panel";

const CONTROL_STYLES =
  "w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 transition hover:border-[rgb(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] disabled:cursor-not-allowed disabled:opacity-60";



interface OverviewFiltersProps {
  windowKey: WindowOption;
  barberId: string;
  barbers: Barber[];
  onWindowChange: (value: WindowOption) => void;
  onBarberChange: (value: string) => void;
}

export function OverviewFilters(props: OverviewFiltersProps) {
  return (
    <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 grid gap-3 sm:grid-cols-3 shadow-[var(--shadow-soft)]">
      <label htmlFor="overview-window" className="space-y-1 text-sm">
        <span className="text-[rgb(var(--muted))]">Ventana</span>
        <select
          id="overview-window"
          value={props.windowKey}
          onChange={(event) => props.onWindowChange(event.target.value as WindowOption)}
          className={CONTROL_STYLES}
          aria-label="Seleccionar ventana de tiempo"
        >
          <option value="next_7_days">Próximos 7 días</option>
          <option value="next_30_days">Próximos 30 días</option>
          <option value="last_7_days">Últimos 7 días</option>
          <option value="last_30_days">Últimos 30 días</option>
        </select>
      </label>

       <label htmlFor="overview-barber" className="space-y-1 text-sm sm:col-span-2">
        <span className="text-[rgb(var(--muted))]">Barbero</span>
        <select
          id="overview-barber"
          value={props.barberId}
          onChange={(event) => props.onBarberChange(event.target.value)}
          className={CONTROL_STYLES}
          aria-label="Filtrar por barbero"
        >
          <option value="all">Todos</option>
          {props.barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name} {barber.active ? "" : "(inactivo)"}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
import type { Barber, WindowOption } from "@/types/panel";

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
      <label className="space-y-1 text-sm">
        <span className="text-[rgb(var(--muted))]">Ventana</span>
        <select
          value={props.windowKey}
          onChange={(event) => props.onWindowChange(event.target.value as WindowOption)}
          className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2"
        >
          <option value="next_7_days">Próximos 7 días</option>
          <option value="next_30_days">Próximos 30 días</option>
          <option value="last_7_days">Últimos 7 días</option>
          <option value="last_30_days">Últimos 30 días</option>
        </select>
      </label>

      <label className="space-y-1 text-sm sm:col-span-2">
        <span className="text-[rgb(var(--muted))]">Barbero</span>
        <select
          value={props.barberId}
          onChange={(event) => props.onBarberChange(event.target.value)}
          className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2"
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
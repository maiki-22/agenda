import { WINDOW_LABELS, type Barber, type WindowOption } from "@/types/panel";
import { BarberPills } from "@/components/panel/overview/barber-pills";

type DateRange = { startDate: string; endDate: string };

type DashboardFiltersProps = {
  windowKey: WindowOption;
  barberId: string;
  barbers: Barber[];
  customRange: DateRange;
  onWindowChange: (value: WindowOption) => void;
  onBarberChange: (value: string) => void;
  onCustomRangeChange: (value: DateRange) => void;
};

const WINDOW_OPTIONS: Array<{ value: WindowOption; label: string }> = [
  { value: "today", label: "Hoy" },
  { value: "next_7_days", label: "7 días" },
  { value: "next_30_days", label: "30 días" },
  { value: "custom", label: "Personalizado" },
];



function WindowPills({ value, onChange }: { value: WindowOption; onChange: (nextValue: WindowOption) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {WINDOW_OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={[
              "rounded-[var(--btn-radius)] border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-out",
              isActive
                ? "btn-gold border-transparent"
                : "border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function CustomDateRange({ value, onChange }: { value: DateRange; onChange: (nextValue: DateRange) => void }) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
        Desde
        <input
          type="date"
          value={value.startDate}
          onChange={(event) => onChange({ startDate: event.target.value, endDate: value.endDate })}
          className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
          aria-label="Fecha de inicio"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
        Hasta
        <input
          type="date"
          min={value.startDate}
          value={value.endDate}
          onChange={(event) => onChange({ startDate: value.startDate, endDate: event.target.value })}
          className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
          aria-label="Fecha de fin"
        />
      </label>
    </div>
  );
}



export function DashboardFilters({ windowKey, barberId, barbers, customRange, onWindowChange, onBarberChange, onCustomRangeChange }: DashboardFiltersProps) {
  const selectedWindow = WINDOW_LABELS[windowKey];
  const selectedBarber = barberId === "all" ? "Todos los barberos" : (barbers.find((barber) => barber.id === barberId)?.name ?? "Barbero");
  return (
    <section className="w-full surface-card rounded-[var(--card-radius)] p-4 fade-up sm:mx-auto sm:max-w-2xl sm:p-5 lg:mx-0 lg:max-w-none">
      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">Ventana</p>
        <WindowPills value={windowKey} onChange={onWindowChange} />
          {windowKey === "custom" ? <CustomDateRange value={customRange} onChange={onCustomRangeChange} /> : null}
      </div>
      <div className="my-4 border-t border-[rgb(var(--border))]" />
      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">Barbero</p>
        <BarberPills barbers={barbers} value={barberId} onChange={onBarberChange} />
      </div>
      <p className="mt-3 text-xs text-[rgb(var(--muted))]">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 align-middle rounded-full bg-[rgb(var(--primary))]" />
        Mostrando <span className="font-semibold text-[rgb(var(--fg))]">{selectedWindow}</span>
        {" · "}
        <span className="font-semibold text-[rgb(var(--fg))]">{selectedBarber}</span>
      </p>

    </section>
    
  );
}
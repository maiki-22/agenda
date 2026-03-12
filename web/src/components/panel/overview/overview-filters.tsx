import type { Barber, WindowOption } from "@/types/panel";

type DashboardFiltersProps = {
  windowKey: WindowOption;
  barberId: string;
  barbers: Barber[];
  onWindowChange: (value: WindowOption) => void;
  onBarberChange: (value: string) => void;
  };

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

const WINDOW_OPTIONS: FilterOption<WindowOption>[] = [
  { value: "next_7_days", label: "Próximos 7 días" },
  { value: "next_30_days", label: "Próximos 30 días" },
  { value: "last_7_days", label: "Últimos 7 días" },
  { value: "last_30_days", label: "Últimos 30 días" },
];

const BARBER_ALL_OPTION = { id: "all", name: "Todos" } as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarTone(name: string): string {
  const tones = [
    "bg-[rgb(var(--primary)/0.18)] text-[rgb(var(--primary))]",
    "bg-[rgb(var(--surface-2))] text-[rgb(var(--fg))]",
  ] as const;

  const hash = Array.from(name).reduce((acc, char) => {
    return (acc * 31 + char.charCodeAt(0)) % 997;
  }, 0);

  return tones[hash % tones.length];
}

function WindowPills({
  value,
  onChange,
}: {
  value: WindowOption;
  onChange: (nextValue: WindowOption) => void;
}) {
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

function BarberPills({
  barbers,
  value,
  onChange,
}: {
  barbers: Barber[];
  value: string;
  onChange: (nextValue: string) => void;
}) {
  const options = [BARBER_ALL_OPTION, ...barbers];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((barber) => {
        const isActive = barber.id === value;

        return (
          <button
            key={barber.id}
            type="button"
            onClick={() => onChange(barber.id)}
            aria-pressed={isActive}
            className={[
              "inline-flex items-center gap-2 rounded-[var(--btn-radius)] border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-out",
              isActive
                ? "border-[rgb(var(--primary)/0.36)] bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary))]"
                : "border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]",
            ].join(" ")}
          >
            {barber.id === BARBER_ALL_OPTION.id ? (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(var(--surface-2))] text-xs font-bold text-[rgb(var(--muted))]">
                ✦
              </span>
            ) : (
              <span
                className={[
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold",
                  getAvatarTone(barber.name),
                ].join(" ")}
                aria-hidden="true"
              >
                {getInitials(barber.name)}
              </span>
            )}
            <span>
              {barber.name}
              {"active" in barber && !barber.active ? " (inactivo)" : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function DashboardFilters({
  windowKey,
  barberId,
  barbers,
  onWindowChange,
  onBarberChange,
}: DashboardFiltersProps) {
  return (
    <section className="w-full surface-card rounded-[var(--card-radius)] p-4 fade-up sm:mx-auto sm:max-w-2xl sm:p-5 lg:mx-0 lg:max-w-none">
      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
          Ventana
        </p>
        <WindowPills value={windowKey} onChange={onWindowChange} />
      </div>

      <div className="my-4 border-t border-[rgb(var(--border))]" />

      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
          Barbero
        </p>
        <BarberPills barbers={barbers} value={barberId} onChange={onBarberChange} />
      </div>
      <p className="mt-3 text-xs text-[rgb(var(--muted))]">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[rgb(var(--primary))] mr-1.5 align-middle" />
          {WINDOW_OPTIONS.find(o => o.value === windowKey)?.label}
          {" · "}
          {barberId === "all" ? "Todos los barberos" : barbers.find(b => b.id === barberId)?.name}
      </p>

    </section>
    
  );
}
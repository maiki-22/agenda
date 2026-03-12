import { getAvatarTone, getInitials } from "@/lib/ui/avatar";
import type { Barber } from "@/types/panel";

const BARBER_ALL_OPTION = { id: "all", name: "Todos" } as const;

interface BarberPillsProps {
  barbers: Barber[];
  value: string;
  includeAll?: boolean;
  onChange: (nextValue: string) => void;
}

export function BarberPills({
  barbers,
  value,
  includeAll = true,
  onChange,
}: BarberPillsProps) {
  const options = includeAll ? [BARBER_ALL_OPTION, ...barbers] : barbers;

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
            <span>{barber.name}</span>
          </button>
        );
      })}
    </div>
  );
}
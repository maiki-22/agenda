import { Toggle } from "@/components/ui/Toggle";
import type { ScheduleDay } from "@/types/panel";

interface ScheduleDayRowProps {
  day: ScheduleDay;
  dayLabel: string;
  onChange: (nextDay: ScheduleDay) => void;
}

export function ScheduleDayRow({ day, dayLabel, onChange }: ScheduleDayRowProps) {
  const inputStateClass = day.active ? "" : "opacity-40";

  return (
    <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Toggle
          checked={day.active}
          onChange={() => {
            onChange({ ...day, active: !day.active });
          }}
          label={`Activar ${dayLabel}`}
          aria-label={`Activar ${dayLabel}`}
        />
        <p className="text-sm font-medium text-[rgb(var(--fg))]">{dayLabel}</p>
      </div>

      <div className={`flex items-center gap-2 ${inputStateClass}`}>
        <label className="sr-only" htmlFor={`start-${day.dow}`}>
          Inicio {dayLabel}
        </label>
        <input
          id={`start-${day.dow}`}
          type="time"
          disabled={!day.active}
          value={day.startTime}
          onChange={(event) => {
            onChange({ ...day, startTime: event.target.value });
          }}
          className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
        />
        <span className="text-xs text-[rgb(var(--muted))]">a</span>
        <label className="sr-only" htmlFor={`end-${day.dow}`}>
          Fin {dayLabel}
        </label>
        <input
          id={`end-${day.dow}`}
          type="time"
          disabled={!day.active}
          value={day.endTime}
          onChange={(event) => {
            onChange({ ...day, endTime: event.target.value });
          }}
          className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
        />
      </div>
    </div>
  );
}
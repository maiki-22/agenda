import { Trash2 } from "lucide-react";
import type { ScheduleBreak } from "@/types/panel";

interface ScheduleBreaksSectionProps {
  dayLabel: string;
  breaks: ScheduleBreak[];
  onChangeBreak: (index: number, key: "startTime" | "endTime", value: string) => void;
  onRemoveBreak: (index: number) => void;
  onAddBreak: () => void;
}

export function ScheduleBreaksSection({
  dayLabel,
  breaks,
  onChangeBreak,
  onRemoveBreak,
  onAddBreak,
}: ScheduleBreaksSectionProps) {
  return (
    <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
      <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">Pausas y descansos</h3>
      <p className="mt-1 text-xs text-[rgb(var(--muted))]">{dayLabel}</p>

      {breaks.length === 0 ? (
        <p className="mt-4 text-xs text-[rgb(var(--muted))]">Sin pausas registradas.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {breaks.map((breakItem, index) => (
            <li key={`${dayLabel}-break-${index}`} className="flex items-center gap-2">
              <span className="min-w-20 text-xs text-[rgb(var(--muted))]">Pausa {index + 1}</span>
              <input
                type="time"
                value={breakItem.startTime}
                onChange={(event) => {
                  onChangeBreak(index, "startTime", event.target.value);
                }}
                aria-label={`Inicio de pausa ${index + 1} ${dayLabel}`}
                className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
              />
              <input
                type="time"
                value={breakItem.endTime}
                onChange={(event) => {
                  onChangeBreak(index, "endTime", event.target.value);
                }}
                aria-label={`Fin de pausa ${index + 1} ${dayLabel}`}
                className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
              />
              <button
                type="button"
                onClick={() => {
                  onRemoveBreak(index);
                }}
                aria-label={`Eliminar pausa ${index + 1}`}
                className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-2 text-red-400 transition-colors duration-200 ease-out hover:bg-[rgb(var(--border))]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onAddBreak}
        className="mt-4 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-2 text-sm font-medium text-[rgb(var(--fg))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--border))]"
      >
        + Agregar pausa
      </button>
    </section>
  );
}
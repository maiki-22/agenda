import { Trash2 } from "lucide-react";
import type { ScheduleDay } from "@/types/panel";

interface ScheduleDayCardProps {
  day: ScheduleDay;
  dayLabel: string;
  onChange: (nextDay: ScheduleDay) => void;
}

export function ScheduleDayCard({ day, dayLabel, onChange }: ScheduleDayCardProps) {
  return (
    <article className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[rgb(var(--fg))]">{dayLabel}</p>
        <label className="inline-flex items-center gap-2 text-xs text-[rgb(var(--muted))]">
          <span>Activo</span>
          <input
            type="checkbox"
            checked={day.active}
            onChange={(event) => {
              onChange({ ...day, active: event.target.checked });
            }}
            aria-label={`Activar ${dayLabel}`}
          />
        </label>
      </div>

      {day.active ? (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
              Inicio
              <input
                type="time"
                value={day.startTime}
                onChange={(event) => {
                  onChange({ ...day, startTime: event.target.value });
                }}
                className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
              Fin
              <input
                type="time"
                value={day.endTime}
                onChange={(event) => {
                  onChange({ ...day, endTime: event.target.value });
                }}
                className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
              />
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">Pausas</p>
            {day.breaks.length === 0 ? (
              <p className="text-xs text-[rgb(var(--muted))]">Sin pausas registradas.</p>
            ) : (
              <ul className="space-y-2">
                {day.breaks.map((breakItem, index) => (
                  <li key={`${day.dow}-break-${index}`} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={breakItem.startTime}
                      onChange={(event) => {
                        onChange({
                          ...day,
                          breaks: day.breaks.map((item, breakIndex) =>
                            breakIndex === index
                              ? { ...item, startTime: event.target.value }
                              : item,
                          ),
                        });
                      }}
                      className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
                      aria-label={`Inicio de pausa ${index + 1} ${dayLabel}`}
                    />
                    <input
                      type="time"
                      value={breakItem.endTime}
                      onChange={(event) => {
                        onChange({
                          ...day,
                          breaks: day.breaks.map((item, breakIndex) =>
                            breakIndex === index
                              ? { ...item, endTime: event.target.value }
                              : item,
                          ),
                        });
                      }}
                      className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
                      aria-label={`Fin de pausa ${index + 1} ${dayLabel}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onChange({
                          ...day,
                          breaks: day.breaks.filter((_, breakIndex) => breakIndex !== index),
                        });
                      }}
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-2 text-[rgb(var(--muted))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--border))]"
                      aria-label="Eliminar pausa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              disabled={day.breaks.length >= 1}
              onClick={() => {
                onChange({
                  ...day,
                  breaks: [...day.breaks, { startTime: "13:00", endTime: "14:00" }],
                });
              }}
              className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-2 text-sm font-medium text-[rgb(var(--fg))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--border))] disabled:cursor-not-allowed disabled:opacity-60"
            >
              + Agregar pausa
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
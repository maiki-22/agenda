"use client";

import { useState } from "react";
import type { ScheduleBreak } from "@/types/panel";

interface ScheduleBreaksSectionProps {
  dayLabel: string;
  breaks: ScheduleBreak[];
  onRemoveBreak: (index: number) => void;
  onAddBreak: (input: { startTime: string; endTime: string; name: string }) => void;
}

export function ScheduleBreaksSection({
  dayLabel,
  breaks,
  onRemoveBreak,
  onAddBreak,
}: ScheduleBreaksSectionProps) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("13:00");
  const [endTime, setEndTime] = useState<string>("14:00");

  return (
    <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
      <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">Pausas y descansos</h3>
      <p className="mt-1 text-xs text-[rgb(var(--muted))]">{dayLabel}</p>

      {breaks.length === 0 ? (
        <p className="mt-4 text-xs text-[rgb(var(--muted))]">Sin pausas registradas.</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {breaks.map((breakItem, index) => (
            <li
              key={`${dayLabel}-break-${index}`}
              className="inline-flex items-center gap-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-xs text-[rgb(var(--fg))]"
            >
              <span className="font-medium">{`Pausa ${index + 1}`}</span>
              <span className="text-[rgb(var(--muted))]">
                {breakItem.startTime} - {breakItem.endTime}
              </span>
              <button
                type="button"
                onClick={() => onRemoveBreak(index)}
                aria-label={`Eliminar pausa ${index + 1}`}
                className="text-sm text-[rgb(var(--muted))] transition-colors duration-200 ease-out hover:text-[rgb(var(--fg))]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <div className="mt-4 space-y-3 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3">
          <div>
            <label htmlFor={`break-name-${dayLabel}`} className="text-xs text-[rgb(var(--muted))]">
              Nombre
            </label>
            <input
              id={`break-name-${dayLabel}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Almuerzo"
              className="mt-1 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`break-start-${dayLabel}`} className="text-xs text-[rgb(var(--muted))]">
                Desde
              </label>
              <input
                id={`break-start-${dayLabel}`}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
              />
            </div>
            <div>
              <label htmlFor={`break-end-${dayLabel}`} className="text-xs text-[rgb(var(--muted))]">
                Hasta
              </label>
              <input
                id={`break-end-${dayLabel}`}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--fg))]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onAddBreak({ startTime, endTime, name });
                setShowForm(false);
                setName("");
              }}
              className="btn-gold px-3 py-2 text-sm"
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-4 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-2 text-sm font-medium text-[rgb(var(--fg))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--border))]"
        >
          + Agregar pausa
        </button>
      )}
    </section>
  );
}
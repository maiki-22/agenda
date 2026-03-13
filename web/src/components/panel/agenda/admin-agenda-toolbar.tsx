"use client";

import type { Barber } from "@/types/panel";

type AgendaView = "day" | "week";

interface AdminAgendaToolbarProps {
  currentDate: string;
  view: AgendaView;
  selectedBarberId: string;
  barbers: Array<Barber>;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: AgendaView) => void;
  onBarberChange: (barberId: string) => void;
}

function formatLabelDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(parsedDate);
}

export function AdminAgendaToolbar({
  currentDate,
  view,
  selectedBarberId,
  barbers,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onBarberChange,
}: AdminAgendaToolbarProps) {
  return (
    <section className="surface-card flex flex-col gap-3 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm font-medium transition-colors duration-200 ease-out hover:bg-[rgb(var(--border))]"
            aria-label="Ir al período anterior"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm font-medium transition-colors duration-200 ease-out hover:bg-[rgb(var(--border))]"
            aria-label="Ir al período siguiente"
          >
            Siguiente →
          </button>
          <button
            type="button"
            onClick={onToday}
            className="btn-gold px-4 py-2 text-sm font-semibold"
          >
            Hoy
          </button>
        </div>

        <p className="text-sm font-semibold text-[rgb(var(--fg))]">
          {formatLabelDate(currentDate)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto,1fr]">
        <div
          className="inline-flex rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-1"
          role="tablist"
          aria-label="Vista de agenda"
        >
          {([
            { id: "day", label: "Día" },
            { id: "week", label: "Semana" },
          ] as const).map((option) => {
            const isActive = option.id === view;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onViewChange(option.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-out ${
                  isActive
                    ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                    : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
          Barbero
          <select
            aria-label="Filtrar agenda por barbero"
            value={selectedBarberId}
            onChange={(event) => onBarberChange(event.target.value)}
            className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm font-medium text-[rgb(var(--fg))]"
          >
            <option value="">Todos los barberos</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export type { AgendaView };
"use client";

import { useMemo, useState } from "react";
import { ScheduleDayCard } from "@/components/panel/scheduling/schedule-day-card";
import { useToast } from "@/components/ui/toast-provider";
import { useSchedule } from "@/hooks/panel/use-schedule";
import type { ScheduleDay } from "@/types/panel";

interface ScheduleEditorProps {
  barberId: string;
}

const WEEK_DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

function cloneDay(day: ScheduleDay): ScheduleDay {
  return {
    ...day,
    breaks: day.breaks.map((item) => ({ ...item })),
  };
}

export function ScheduleEditor({ barberId }: ScheduleEditorProps) {
  const toast = useToast();
  const scheduleState = useSchedule(barberId);
  const [draftDays, setDraftDays] = useState<ScheduleDay[] | null>(null);
  const activeDraftDays =
    draftDays ?? scheduleState.schedule?.days.map(cloneDay) ?? [];

  const canSave = useMemo<boolean>(
    () => activeDraftDays.length === 7 && !scheduleState.loading && !scheduleState.saving,
    [activeDraftDays.length, scheduleState.loading, scheduleState.saving],
  );

  const onSave = async (): Promise<void> => {
    if (!canSave) return;

    const error = await scheduleState.saveSchedule(activeDraftDays);
    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Horario guardado correctamente");
  };

  if (scheduleState.loading) {
    return (
      <section className="surface-card rounded-[var(--card-radius)] p-5">
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`schedule-loading-${index}`} className="h-16 rounded-lg bg-[rgb(var(--surface-2))] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (scheduleState.error) {
    return (
      <section className="surface-card rounded-[var(--card-radius)] p-5">
        <p className="text-sm font-medium text-[rgb(var(--fg))]">No se pudo cargar el horario</p>
        <p className="mt-1 text-xs text-[rgb(var(--muted))]">{scheduleState.error}</p>
        <button
          type="button"
          onClick={() => {
            void scheduleState.retry();
          }}
          className="mt-3 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-2 text-sm font-medium text-[rgb(var(--fg))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--border))]"
        >
          Reintentar
        </button>
      </section>
    );
  }

  return (
    <section className="surface-card rounded-[var(--card-radius)] p-5">
      <div className="space-y-4">
        {activeDraftDays.map((day) => (
          <ScheduleDayCard
            key={day.dow}
            day={day}
            dayLabel={WEEK_DAYS[day.dow]}
            onChange={(nextDay) => {
              setDraftDays((current) =>
                (current ?? activeDraftDays).map((item) =>
                  item.dow === day.dow ? cloneDay(nextDay) : item,
                ),
              );
            }}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={!canSave}
        onClick={() => {
          void onSave();
        }}
        className="btn-gold mt-4 w-full px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {scheduleState.saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </section>
  );
}
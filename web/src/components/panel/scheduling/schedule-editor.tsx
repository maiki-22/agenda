"use client";

import { useMemo, useState } from "react";
import { ScheduleDayCard } from "@/components/panel/scheduling/schedule-day-card";
import { useToast } from "@/components/ui/toast-provider";
import { useSchedule } from "@/hooks/panel/use-schedule";
import type { ScheduleDay } from "@/types/panel";

interface ScheduleEditorProps {
  barberId: string;
}

const WEEK_DAYS: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

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
  const activeDraftDays = useMemo<ScheduleDay[]>(
    () => draftDays ?? scheduleState.schedule?.days.map(cloneDay) ?? [],
    [draftDays, scheduleState.schedule?.days],
  );

  const sortedDays = useMemo<ScheduleDay[]>(() => {
    const dayByDow = new Map(activeDraftDays.map((day) => [day.dow, day]));
    return WEEK_ORDER.map((dow) => dayByDow.get(dow)).filter(
      (day): day is ScheduleDay => Boolean(day),
    );
  }, [activeDraftDays]);

  const canSave = useMemo<boolean>(
    () =>
      sortedDays.length === 7 &&
      !scheduleState.loading &&
      !scheduleState.saving,
    [sortedDays.length, scheduleState.loading, scheduleState.saving],
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
            <div
              key={`schedule-loading-${index}`}
              className="h-16 animate-pulse rounded-lg bg-[rgb(var(--surface-2))]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (scheduleState.error) {
    return (
      <section className="surface-card rounded-[var(--card-radius)] p-5">
        <p className="text-sm font-medium text-[rgb(var(--fg))]">
          No se pudo cargar el horario
        </p>
        <p className="mt-1 text-xs text-[rgb(var(--muted))]">
          {scheduleState.error}
        </p>
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
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[rgb(var(--fg))]">
          Horarios de atención
        </h2>
        <button
          type="button"
          disabled={!canSave}
          onClick={() => {
            void onSave();
          }}
          className="btn-gold px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {scheduleState.saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </header>

      <div className="space-y-1">
        {sortedDays.map((day) => (
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
    </section>
  );
}

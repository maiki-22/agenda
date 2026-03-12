"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { formatDateLongCL } from "@/lib/datetime/ui-date-format";

interface PanelDateScrollerProps {
  value: string;
  onChange: (iso: string) => void;
  minDate?: string;
  monthsAhead?: number;
}

type DayItem = {
  iso: string;
  weekdayShort: string;
  dayNumber: string;
  monthLabel: string;
  disabled: boolean;
};

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseISODate(input: string): Date {
  const [year, month, day] = input.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function normalizeSpanish(value: string): string {
  return value.length ? value[0].toUpperCase() + value.slice(1) : value;
}

export function PanelDateScroller({
  value,
  onChange,
  minDate,
  monthsAhead = 3,
}: PanelDateScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const minDateIso = minDate ?? toISODate(new Date());
  const minDateValue = useMemo(() => parseISODate(minDateIso), [minDateIso]);
  const initialMonth = value ? parseISODate(value) : minDateValue;
  const [activeMonth, setActiveMonth] = useState<Date>(startOfMonth(initialMonth));

  const monthDiff =
    (activeMonth.getFullYear() - minDateValue.getFullYear()) * 12 +
    (activeMonth.getMonth() - minDateValue.getMonth());
  const canGoPrevious = monthDiff > 0;
  const canGoNext = monthDiff < monthsAhead;

  const headerLabel = useMemo(() => {
    const monthText = new Intl.DateTimeFormat("es-CL", {
      month: "long",
      year: "numeric",
    }).format(activeMonth);
    return normalizeSpanish(monthText);
  }, [activeMonth]);

  const items = useMemo<DayItem[]>(() => {
    const daysInMonth = new Date(
      activeMonth.getFullYear(),
      activeMonth.getMonth() + 1,
      0,
    ).getDate();
    const weekdayFormatter = new Intl.DateTimeFormat("es-CL", { weekday: "short" });
    const monthFormatter = new Intl.DateTimeFormat("es-CL", { month: "short" });

    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), index + 1);
      const iso = toISODate(date);
      return {
        iso,
        weekdayShort: normalizeSpanish(
          weekdayFormatter.format(date).replace(".", "").slice(0, 3),
        ),
        dayNumber: String(date.getDate()),
        monthLabel: normalizeSpanish(monthFormatter.format(date).replace(".", "")),
        disabled: iso < minDateIso,
      } satisfies DayItem;
    });
  }, [activeMonth, minDateIso]);

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element) return;
    drag.current = {
      active: true,
      startX: event.pageX,
      scrollLeft: element.scrollLeft,
      moved: false,
    };
  }, []);

  const onMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const element = scrollRef.current;
    if (!element) return;
    const distance = event.pageX - drag.current.startX;
    if (Math.abs(distance) > 4) {
      drag.current.moved = true;
    }
    element.scrollLeft = drag.current.scrollLeft - distance;
  }, []);

  const onMouseUp = useCallback(() => {
    drag.current.active = false;
  }, []);

  return (
    <div className="space-y-3">
      <header className="flex items-center justify-between rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => {
            if (!canGoPrevious) return;
            setActiveMonth(
              new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1),
            );
          }}
          className="rounded-lg px-2 py-1 text-[rgb(var(--muted))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--surface))] disabled:opacity-40"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-[rgb(var(--fg))]">{headerLabel}</p>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => {
            if (!canGoNext) return;
            setActiveMonth(
              new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1),
            );
          }}
          className="rounded-lg px-2 py-1 text-[rgb(var(--muted))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--surface))] disabled:opacity-40"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </header>

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-2 overflow-x-auto py-1 no-scrollbar [touch-action:pan-x]"
      >
        {items.map((item) => {
          const selected = value === item.iso;
          return (
            <button
              key={item.iso}
              type="button"
              disabled={item.disabled}
              onClick={(event) => {
                if (drag.current.moved) {
                  event.preventDefault();
                  return;
                }
                if (item.disabled) return;
                onChange(item.iso);
              }}
              className={[
                "shrink-0 w-16 rounded-lg border bg-[rgb(var(--surface-2))] px-2 py-2 text-center transition-colors duration-200 ease-out",
                selected
                  ? "border-[rgb(var(--primary))]"
                  : "border-[rgb(var(--border))] hover:bg-[rgb(var(--surface))]",
                item.disabled ? "opacity-45 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <p className="text-[10px] uppercase tracking-wide text-[rgb(var(--muted))]">
                {item.weekdayShort}
              </p>
              <p className="mt-1 text-2xl font-semibold leading-none text-[rgb(var(--fg))]">
                {item.dayNumber}
              </p>
              <p className="mt-1 text-[10px] text-[rgb(var(--muted))]">{item.monthLabel}</p>
              <span
                className={[
                  "mt-2 block h-1 rounded-full",
                  selected ? "bg-[rgb(var(--primary))]" : "bg-transparent",
                ].join(" ")}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[rgb(var(--muted))]">
        {value ? `Seleccionado: ${formatDateLongCL(value)}` : "Selecciona una fecha"}
      </p>
    </div>
  );
}
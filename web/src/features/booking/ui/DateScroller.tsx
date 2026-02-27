"use client";
import { useRef, useCallback, useMemo, useEffect, useState } from "react";

const MIN_LEAD_MINUTES = 30;

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, days: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function isSlotAtLeastMinutesFromNow(dateYYYYMMDD: string, hhmm: string, minMinutes: number) {
  const [y, m, d] = dateYYYYMMDD.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const slot = new Date(y, m - 1, d, hh, mm, 0, 0).getTime();
  return slot - Date.now() >= minMinutes * 60 * 1000;
}



type DayItem = {
  iso: string;
  labelTop: string;
  dayNumber: string;
  monthShort: string;
};

export function DateScroller({
  value,
  onChange,
  barberId,
  service,
  daysAhead = 7,
}: {
  value: string;
  onChange: (iso: string) => void;
  barberId: string;
  service: string;
  daysAhead?: number;
}) {
  const [availabilityByDate, setAvailabilityByDate] = useState<Record<string, boolean>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.pageX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag.current.active) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  }, []);

  const onMouseUp = useCallback(() => {
    drag.current.active = false;
  }, []);


  const items = useMemo<DayItem[]>(() => {
    const today = new Date();
    const fmtWeekday = new Intl.DateTimeFormat("es-CL", { weekday: "short" });
    const fmtMonth = new Intl.DateTimeFormat("es-CL", { month: "short" });
    const out: DayItem[] = [];

    for (let i = 0; i <= daysAhead; i++) {
      const d = addDays(today, i);
      const iso = toISODate(d);
      const labelTop =
        i === 0 ? "Hoy" : capitalize(fmtWeekday.format(d).replace(".", ""));
      const dayNumber = String(d.getDate());
      const monthShort = capitalize(fmtMonth.format(d).replace(".", ""));
      out.push({ iso, labelTop, dayNumber, monthShort });
    }
    return out;
  }, [daysAhead]);

    useEffect(() => {
    let ok = true;

    async function run() {
      if (!barberId || !service) {
        setAvailabilityByDate({});
        return;
      }

      setLoadingAvailability(true);
      try {
        const checks = await Promise.all(
          items.map(async (it) => {
            const params = new URLSearchParams({
              barberId,
              date: it.iso,
              service,
            });

            const res = await fetch(`/api/availability?${params.toString()}`, {
              cache: "no-store",
            });

            if (!res.ok) return [it.iso, false] as const;

            const json = await res.json();
            const slots = Array.isArray(json?.slots) ? json.slots : [];
            const hasValidSlots = slots.some((slot: string) =>
              isSlotAtLeastMinutesFromNow(it.iso, slot, MIN_LEAD_MINUTES)
            );

            return [it.iso, hasValidSlots] as const;
          })
        );

        if (!ok) return;
        setAvailabilityByDate(Object.fromEntries(checks));
      } finally {
        if (ok) setLoadingAvailability(false);
      }
    }

    run();

    return () => {
      ok = false;
    };
  }, [barberId, service, items]);

  useEffect(() => {
    if (!value) return;
    if (loadingAvailability) return;
    if (availabilityByDate[value] === false) onChange("");
  }, [value, loadingAvailability, availabilityByDate, onChange]);

  // Evita disparar onChange si el usuario estaba arrastrando
  const makeClickHandler = useCallback(
    (iso: string, disabled: boolean) => (e: React.MouseEvent) => {
      if (drag.current.moved) {
        e.preventDefault();
        return;
      }
      if (disabled) return;
      onChange(iso);
    },
    [onChange]
  );


  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
          Selecciona día
        </div>
        <div className="text-xl font-semibold">Fecha</div>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="
          full-bleed
          flex gap-3 py-2 overflow-x-auto no-scrollbar
          [-webkit-overflow-scrolling:touch]
          scroll-px-[var(--page-px)]
          cursor-grab active:cursor-grabbing
          select-none
          [touch-action:pan-x]
        "
      >
        {items.map((it) => {
          const selected = value === it.iso;
          const disabled = !loadingAvailability && availabilityByDate[it.iso] === false;

          return (
            <button
              key={it.iso}
              type="button"
              onClick={makeClickHandler(it.iso, disabled)}
              aria-pressed={selected}
              aria-disabled={disabled}
              disabled={disabled}
              className={[
                "shrink-0 w-20 sm:w-24 lg:w-28",
                "rounded-2xl border px-3 py-3 text-left transition",
                "bg-[rgb(var(--surface-2))] border-[rgb(var(--border))]",
                 disabled
                  ? "opacity-55 saturate-50 cursor-not-allowed"
                  : "hover:brightness-110 active:scale-[0.98] touch-manipulation",
                "focus:outline-none",
                selected
                  ? "ring-2 ring-[rgb(var(--primary))] border-[rgb(var(--primary))]"
                  : "",
              ].join(" ")}
            >
              <div className="text-xs text-[rgb(var(--muted))]">{it.labelTop}</div>
              <div className="mt-1 flex items-end justify-between">
 <div className="text-2xl font-bold leading-none">{it.dayNumber}</div>
                <div className="text-xs text-[rgb(var(--muted))]">{it.monthShort}</div>
              </div>

              <div
                className={[
                  "mt-2 h-1 w-8 rounded-full transition-colors",
                  selected
                    ? "bg-[rgb(var(--primary))]"
                   : disabled
                      ? "bg-[rgb(var(--muted))]/35"
                      : "bg-[rgb(var(--border))]",
                ].join(" ")}
              />
              
            </button>
          );
        })}
      </div>

      <p className="text-sm text-[rgb(var(--muted))]">
        Puedes reservar con hasta {daysAhead} días de anticipación. Los días sin disponibilidad aparecen atenuados.
      </p>
    </div>
  );
}

function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import type { ServiceType } from "../domain/booking.types";

const MIN_LEAD_MINUTES = 30;

function isSlotAtLeastMinutesFromNow(dateYYYYMMDD: string, hhmm: string, minMinutes: number) {
  // Hora local del navegador (UX). La seguridad real va en backend.
  const [y, m, d] = dateYYYYMMDD.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const slot = new Date(y, m - 1, d, hh, mm, 0, 0).getTime();
  return slot - Date.now() >= minMinutes * 60 * 1000;
}

export function TimeSelector({
  barberId,
  date,
  service,
  value,
  onChange,
  refreshKey,
}: {
  barberId: string;
  date: string;
  service: ServiceType | "";
  value: string;
  onChange: (v: string) => void;
  refreshKey: number;
}) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const canLoad = Boolean(barberId && date && service);

  const url = useMemo(() => {
    if (!canLoad) return "";
    const params = new URLSearchParams({
      barberId,
      date,
      service: service as string,
    });
    return `/api/availability?${params.toString()}`;
  }, [barberId, date, service, canLoad]);

  useEffect(() => {
    let ok = true;

    async function run() {
      if (!url) return;
      setLoading(true);
      try {
        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();
        if (!ok) return;
        setSlots(Array.isArray(json.slots) ? json.slots : []);
      } finally {
        if (ok) setLoading(false);
      }
    }

    run();

    return () => {
      ok = false;
    };
  }, [url, refreshKey]);

  const filteredSlots = useMemo(() => {
    if (!date) return [];
    return slots.filter((t) => isSlotAtLeastMinutesFromNow(date, t, MIN_LEAD_MINUTES));
  }, [slots, date]);

  // Si el usuario tenía seleccionada una hora que quedó inválida, la limpiamos
  useEffect(() => {
    if (!value) return;
    if (!date) return;
    const stillOk = isSlotAtLeastMinutesFromNow(date, value, MIN_LEAD_MINUTES);
    if (!stillOk) onChange("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, value]);

  if (!canLoad) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Selecciona la hora</h2>
        <p className="text-sm text-[rgb(var(--muted))]">
          Primero elige barbero, servicio y día.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
          Selecciona hora
        </div>
        <div className="text-xl font-semibold">Hora</div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 text-sm text-[rgb(var(--muted))]">
          Cargando horarios...
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 text-sm text-[rgb(var(--muted))]">
          No hay horarios disponibles para este día.
          <div className="mt-2 text-xs">
            Recuerda: se requiere al menos {MIN_LEAD_MINUTES} minutos de anticipación.
          </div>
        </div>
      ) : (
        <div className="grid-times">
          {filteredSlots.map((t) => {
            const selected = value === t;

            return (
              <button
                key={t}
                type="button"
                onClick={() => onChange(t)}
                aria-pressed={selected}
                className={[
                  "min-h-[48px] rounded-2xl px-3 py-3 text-sm font-semibold transition",
                  "border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--fg))]",
                  "hover:brightness-110 active:scale-[0.99] touch-manipulation",
                  "focus:outline-none",
                  selected
                    ? "ring-2 ring-[rgb(var(--primary))] border-[rgb(var(--primary))]"
                    : "",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-sm text-[rgb(var(--muted))]">
        Los bloques son de 30 min. Corte + barba ocupa 1 hora.
      </p>
    </div>
  );
}
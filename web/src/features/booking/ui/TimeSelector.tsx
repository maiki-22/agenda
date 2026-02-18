"use client";

import { useEffect, useMemo, useState } from "react";
import type { ServiceType } from "../domain/booking.types";

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
  const canLoad = barberId && date && service;

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
        const res = await fetch(url);
        const json = await res.json();
        if (ok) setSlots(Array.isArray(json.slots) ? json.slots : []);
      } finally {
        if (ok) setLoading(false);
      }
    }
    run();
    return () => {
      ok = false;
    };
  }, [url, refreshKey]);

  if (!canLoad) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Selecciona la hora</h2>
        <p className="text-sm text-gray-500">
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
      ) : slots.length === 0 ? (
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 text-sm text-[rgb(var(--muted))]">
          No hay horarios disponibles para este día.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {slots.map((t) => {
            const selected = value === t;

            return (
              <button
                key={t}
                type="button"
                onClick={() => onChange(t)}
                className={[
  "rounded-2xl px-3 py-3 text-sm font-semibold transition",
  "border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--fg))]",
  "hover:brightness-110 active:scale-[0.99]",
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

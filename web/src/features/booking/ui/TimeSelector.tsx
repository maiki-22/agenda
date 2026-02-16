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
      <h2 className="text-xl font-semibold">Selecciona la hora</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando horarios...</p>
      ) : slots.length === 0 ? (
        <p className="text-sm text-gray-500">No hay horarios disponibles.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-4">
          {slots.map((t) => (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={[
                "rounded-xl border px-3 py-2 text-center",
                value === t ? "border-black" : "border-gray-200",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
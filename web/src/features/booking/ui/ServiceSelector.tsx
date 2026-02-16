"use client";

import { SERVICES } from "../domain/booking.logic";
import type { ServiceType } from "../domain/booking.types";

export function ServiceSelector({
  value,
  onChange,
}: {
  value: ServiceType | "";
  onChange: (s: ServiceType) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Selecciona el servicio</h2>
      <div className="grid gap-2 sm:grid-cols-3">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={[
              "rounded-xl border px-4 py-3 text-left",
              value === s.id ? "border-black" : "border-gray-200",
            ].join(" ")}
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-sm text-gray-500">{s.durationMinutes} min</div>
          </button>
        ))}
      </div>
    </div>
  );
}
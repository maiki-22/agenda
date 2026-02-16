"use client";

import { BARBERS } from "../domain/booking.logic";

export function BarberSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Selecciona un barbero</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {BARBERS.filter((b) => b.isActive).map((b) => (
          <button
            key={b.id}
            onClick={() => onChange(b.id)}
            className={[
              "rounded-xl border px-4 py-3 text-left",
              value === b.id ? "border-black" : "border-gray-200",
            ].join(" ")}
          >
            <div className="font-medium">{b.name}</div>
            <div className="text-sm text-gray-500">Disponible</div>
          </button>
        ))}
      </div>
    </div>
  );
}
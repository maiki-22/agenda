"use client";

import { SERVICES } from "../domain/booking.logic";
import type { ServiceType } from "../domain/booking.types";
import SelectCard from "@/components/ui/SelectCard";

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
          <SelectCard
            key={s.id}
            title={s.label}
            subtitle={`${s.durationMinutes} min`}
            selected={value === s.id}
            onClick={() => onChange(s.id)}
          />
        ))}
      </div>
    </div>
  );
}

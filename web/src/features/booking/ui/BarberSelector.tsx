"use client";

import { BARBERS } from "../domain/booking.logic";
import SelectCard from "@/components/ui/SelectCard";

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
      <div className="grid-cards">
        {BARBERS.filter((b) => b.isActive).map((b) => (
          <SelectCard
            key={b.id}
            title={b.name}
            subtitle="Disponible"
            selected={value === b.id}
            onClick={() => onChange(b.id)}
          />
        ))}
      </div>
    </div>
  );
}

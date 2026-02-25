"use client";

import SelectCard from "@/components/ui/SelectCard";

type CatalogBarber = {
  id: string;
  name: string;
};

export function BarberSelector({
  barbers,
  value,
  onChange,
}: {
  barbers: CatalogBarber[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Selecciona un barbero</h2>
      <div className="grid-cards">
        {barbers.map((b) => (
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
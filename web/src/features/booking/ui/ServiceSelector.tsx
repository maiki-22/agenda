"use client";

import type { ServiceType } from "../domain/booking.types";
import SelectCard from "@/components/ui/SelectCard";

type CatalogService = {
  id: string;
  name: string;
  duration_min: number;
  price_clp: number;
};

function formatCLP(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ServiceSelector({
  services,
  value,
  onChange,
}: {
  services: CatalogService[];
  value: ServiceType | "";
  onChange: (s: ServiceType) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Selecciona el servicio</h2>
      <div className="grid-cards">
        {services.map((s) => (
          <SelectCard
            key={s.id}
            title={s.name}
            subtitle={`${s.duration_min} min • ${formatCLP(s.price_clp)}`}
            selected={value === (s.id as ServiceType)}
            onClick={() => onChange(s.id as ServiceType)}
          />
        ))}
      </div>
    </div>
  );
}
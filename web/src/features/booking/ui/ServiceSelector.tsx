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

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-3/4 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
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
  const loading = services.length === 0;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Selecciona el servicio</h2>

      <div className="grid-cards">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          services.map((s) => (
            <SelectCard
              key={s.id}
              title={s.name}
              subtitle={formatCLP(s.price_clp)}
              selected={value === (s.id as ServiceType)}
              onClick={() => onChange(s.id as ServiceType)}
            />
          ))
        )}
      </div>
    </div>
  );
}

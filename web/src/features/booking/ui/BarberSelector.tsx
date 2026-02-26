"use client";

import SelectCard from "@/components/ui/SelectCard";

type CatalogBarber = {
  id: string;
  name: string;
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-2/3 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-3 w-1/3 rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}

export function BarberSelector({
  barbers,
  value,
  onChange,
}: {
  barbers: CatalogBarber[];
  value: string;
  onChange: (id: string) => void;
}) {
  const loading = barbers.length === 0;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Selecciona un barbero</h2>

      <div className="grid-cards">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          barbers.map((b) => (
            <SelectCard
              key={b.id}
              title={b.name}
              subtitle="Disponible"
              selected={value === b.id}
              onClick={() => onChange(b.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
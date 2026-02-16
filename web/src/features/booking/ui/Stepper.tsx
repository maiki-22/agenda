"use client";

export function Stepper({ step }: { step: number }) {
  const items = ["Barbero", "Servicio", "Día", "Hora", "Tus datos", "Confirmar"];
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {items.map((label, idx) => {
          const n = idx + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div
              key={label}
              className={[
                "rounded-full px-3 py-1 text-sm",
                active ? "bg-black text-white" : done ? "bg-gray-200" : "bg-gray-100",
              ].join(" ")}
            >
              {n}. {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
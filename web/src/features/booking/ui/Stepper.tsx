"use client";

const steps = [
  { n: 1, label: "Barbero" },
  { n: 2, label: "Servicio" },
  { n: 3, label: "Día" },
  { n: 4, label: "Hora" },
  { n: 5, label: "Tus datos" },
  { n: 6, label: "Confirmar" },
] as const;

export function Stepper({
  step,
  onJump,
}: {
  step: number;
  onJump?: (step: number) => void;
}) {
  return (
    
      <div
        className="
  -mx-4 px-4 pt-2 pb-2
  flex gap-2 overflow-x-auto no-scrollbar
  [-webkit-overflow-scrolling:touch]
  scroll-px-4
"
      >
        {steps.map((s) => {
          const active = s.n === step;
          const done = s.n < step;

          return (
            <button
              key={s.n}
              type="button"
              onClick={() => onJump?.(s.n)}
              className={[
                "shrink-0 rounded-full px-3 py-2 text-xs font-medium transition",
                "border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]",
                "hover:brightness-110",
                active
                  ? "ring-2 ring-[rgb(var(--primary))] ring-offset-2 ring-offset-[rgb(var(--bg))]"
                  : "",
                done ? "opacity-95" : "",
                !onJump ? "cursor-default" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  done || active
  ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
  : "bg-[rgb(var(--surface-2))] text-[rgb(var(--muted))] border border-[rgb(var(--border))]"
                ].join(" ")}
              >
                {s.n}
              </span>
              {s.label}
            </button>
          );
        })}
      </div>
  );
}

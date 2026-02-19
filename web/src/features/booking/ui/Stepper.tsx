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
    /*
      full-bleed: clase en globals.css que aplica margin-inline negativo
      igual al padding de page-container, logrando scroll de borde a borde
      sin que los ítems queden pegados al margen.
    */
    <div
      className="
        full-bleed
        flex gap-2 overflow-x-auto no-scrollbar py-2
        [-webkit-overflow-scrolling:touch]
        scroll-px-[var(--page-px)]
        sm:justify-center sm:overflow-x-visible sm:flex-wrap
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
            disabled={!onJump}
            aria-current={active ? "step" : undefined}
            className={[
              /* Tamaño táctil mínimo */
              "shrink-0 min-h-[40px] rounded-full px-3 py-2 text-xs font-medium transition",
              "border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]",
              "hover:brightness-110 touch-manipulation",
              "disabled:cursor-default",
              active
                ? "ring-2 ring-[rgb(var(--primary))] ring-offset-2 ring-offset-[rgb(var(--bg))]"
                : "",
              done ? "opacity-95" : "",
            ].join(" ")}
          >
            <span
              className={[
                "mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                done || active
                  ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                  : "bg-[rgb(var(--surface-2))] text-[rgb(var(--muted))] border border-[rgb(var(--border))]",
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
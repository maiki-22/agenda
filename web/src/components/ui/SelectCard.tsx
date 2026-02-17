"use client";

export default function SelectCard({
  title,
  subtitle,
  selected,
  onClick,
  disabled,
}: {
  title: string;
  subtitle?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full text-left rounded-2xl border px-4 py-4 transition",
        "bg-[rgb(var(--surface))] border-[rgb(var(--border))]",
        "active:scale-[0.99]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "hover:brightness-110",
        selected ? "ring-2 ring-[rgb(var(--primary))]" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold leading-tight">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-sm text-[rgb(var(--muted))]">
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          className={[
            "h-7 w-7 rounded-full grid place-items-center border",
            selected
              ? "bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
              : "bg-transparent border-[rgb(var(--border))] text-[rgb(var(--muted))]",
          ].join(" ")}
          aria-hidden="true"
        >
          {selected ? "✓" : ""}
        </div>
      </div>
    </button>
  );
}

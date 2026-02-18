"use client";

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const today = new Date();
  const max = new Date();
  max.setDate(today.getDate() + 7);

  const minDate = toISODate(today);
  const maxDate = toISODate(max);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Selecciona el día</h2>

      <input
        type="date"
        value={value}
        min={minDate}
        max={maxDate}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-4 py-3 text-[rgb(var(--fg))]"
      />

      <p className="text-sm text-[rgb(var(--muted))]">
        Puedes reservar con hasta 7 días de anticipación.
      </p>
    </div>
  );
}

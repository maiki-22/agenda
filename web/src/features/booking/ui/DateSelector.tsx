"use client";

export function DateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Selecciona el día</h2>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3"
      />
      <p className="text-sm text-gray-500">
        Luego podrás elegir la hora disponible.
      </p>
    </div>
  );
}
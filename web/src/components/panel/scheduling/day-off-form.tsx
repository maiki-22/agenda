import { FormEvent, useState } from "react";

const CONTROL_STYLES =
  "w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2 transition hover:border-[rgb(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] disabled:cursor-not-allowed disabled:opacity-60";


interface DayOffFormProps {
  selectedBarber: string;
  loading: boolean;
  onSubmit: (input: {
    barberId: string;
    date: string;
    reason: string;
  }) => Promise<void>;
}

export function DayOffForm({
  selectedBarber,
  loading,
  onSubmit,
}: DayOffFormProps) {
  const [date, setDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await onSubmit({ barberId: selectedBarber, date, reason });
  }

  return (
     <form
      className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
      aria-live="polite"
    >
      <h3 className="font-semibold">Día libre por barbero</h3>
      <label htmlFor="day-off-date" className="text-xs text-[rgb(var(--muted))]">
        Fecha del día libre
      </label>
      <input
        id="day-off-date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className={CONTROL_STYLES}
        disabled={loading}
        required
      />
      <label htmlFor="day-off-reason" className="text-xs text-[rgb(var(--muted))]">
        Motivo (opcional)
      </label>
      <input
        id="day-off-reason"
        type="text"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Motivo"
        className={CONTROL_STYLES}
        disabled={loading}
      />
      <button
        disabled={loading}
        className="rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] px-3 py-2 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
import { FormEvent, useState } from "react";

const CONTROL_STYLES =
  "w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2 transition hover:border-[rgb(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] disabled:cursor-not-allowed disabled:opacity-60";


interface BarberBlockFormProps {
  selectedBarber: string;
  loading: boolean;
  onSubmit: (input: {
    barberId: string;
    date: string;
    start: string;
    end: string;
    reason: string;
  }) => Promise<void>;
}

export function BarberBlockForm({
  selectedBarber,
  loading,
  onSubmit,
}: BarberBlockFormProps) {
  const [date, setDate] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    await onSubmit({ barberId: selectedBarber, date, start, end, reason });
  }

  return (
    <form
      className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
      aria-live="polite"
    >
      <h3 className="font-semibold">Bloquear horario</h3>
      <label htmlFor="barber-block-date" className="text-xs text-[rgb(var(--muted))]">
        Fecha del bloqueo
      </label>
      <input
        id="barber-block-date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className={CONTROL_STYLES}
        disabled={loading}
        required
      />
      <div className="grid grid-cols-2 gap-2">
         <div className="space-y-1">
          <label htmlFor="barber-block-start" className="text-xs text-[rgb(var(--muted))]">
            Desde
          </label>
          <input
            id="barber-block-start"
            type="time"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className={CONTROL_STYLES}
            disabled={loading}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="barber-block-end" className="text-xs text-[rgb(var(--muted))]">
            Hasta
          </label>
          <input
            id="barber-block-end"
            type="time"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            className={CONTROL_STYLES}
            disabled={loading}
            required
          />
        </div>
      </div>
       <label htmlFor="barber-block-reason" className="text-xs text-[rgb(var(--muted))]">
        Motivo (opcional)
      </label>
      <input
        id="barber-block-reason"
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

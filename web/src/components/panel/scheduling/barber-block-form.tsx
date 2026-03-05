import { FormEvent, useState } from "react";

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
    >
      <h3 className="font-semibold">Bloquear horario</h3>
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
        required
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="time"
          value={start}
          onChange={(event) => setStart(event.target.value)}
          className="rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
          required
        />
        <input
          type="time"
          value={end}
          onChange={(event) => setEnd(event.target.value)}
          className="rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
          required
        />
      </div>
      <input
        type="text"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Motivo"
        className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
      />
      <button
        disabled={loading}
        className="rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] px-3 py-2 disabled:opacity-60"
      >
        Guardar
      </button>
    </form>
  );
}

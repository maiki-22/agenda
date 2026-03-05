import { FormEvent, useState } from "react";

interface ShopClosedFormProps {
  loading: boolean;
  onSubmit: (input: { date: string; reason: string }) => Promise<void>;
}

export function ShopClosedForm({ loading, onSubmit }: ShopClosedFormProps) {
  const [date, setDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await onSubmit({ date, reason });
  }

  return (
    <form className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2 shadow-[var(--shadow-soft)]" onSubmit={handleSubmit}>
      <h3 className="font-semibold">Cerrar barbería (día completo)</h3>
      <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2" required />
      <input type="text" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motivo (feriado, imprevisto...)" className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2" />
      <button disabled={loading} className="rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] px-3 py-2 disabled:opacity-60">Guardar</button>
    </form>
  );
}
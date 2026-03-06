import { FormEvent, useState } from "react";

const CONTROL_STYLES =
  "w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2 transition hover:border-[rgb(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] disabled:cursor-not-allowed disabled:opacity-60";


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
    <form
      className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
      aria-live="polite"
    >
      <h3 className="font-semibold">Cerrar barbería (día completo)</h3>
       <label htmlFor="shop-closed-date" className="text-xs text-[rgb(var(--muted))]">
        Fecha de cierre
      </label>
      <input
        id="shop-closed-date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className={CONTROL_STYLES}
        disabled={loading}
        required
      />
      <label htmlFor="shop-closed-reason" className="text-xs text-[rgb(var(--muted))]">
        Motivo (opcional)
      </label>
      <input
        id="shop-closed-reason"
        type="text"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Motivo (feriado, imprevisto...)"
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
"use client";

import { FormEvent, useState } from "react";
import { PanelDateScroller } from "@/components/panel/scheduling/PanelDateScroller";

const CONTROL_STYLES =
  "w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--surface-2))] disabled:cursor-not-allowed disabled:opacity-60";

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
    <form className="space-y-3" onSubmit={handleSubmit} aria-live="polite">
      <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">Cerrar barbería (día completo)</h3>
      
      <PanelDateScroller 
        value={date} 
        onChange={setDate} 
        minDate={new Date().toISOString().slice(0, 10)} 
      />

      <div className="space-y-1">
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
      </div>

      <button
        disabled={loading || !date}
        className="btn-gold w-full px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
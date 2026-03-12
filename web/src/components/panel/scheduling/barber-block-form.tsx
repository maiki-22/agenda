"use client";

import { FormEvent, useState } from "react";
import { PanelDateScroller } from "@/components/panel/scheduling/PanelDateScroller";
import { PanelTimePicker } from "@/components/panel/scheduling/PanelTimePicker";

const CONTROL_STYLES =
  "w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--surface-2))] disabled:cursor-not-allowed disabled:opacity-60";

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await onSubmit({ barberId: selectedBarber, date, start, end, reason });
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit} aria-live="polite">
      <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">Bloquear horario</h3>
      
      <PanelDateScroller 
        value={date} 
        onChange={setDate} 
        minDate={new Date().toISOString().slice(0, 10)} 
      />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <PanelTimePicker value={start} onChange={setStart} label="Desde" />
        <PanelTimePicker value={end} onChange={setEnd} label="Hasta" />
      </div>

      <div className="space-y-1">
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
      </div>

      <button
        disabled={loading || !date || !start || !end}
        className="btn-gold w-full px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
"use client";

import { FormEvent, useState } from "react";
import { PanelDateScroller } from "@/components/panel/scheduling/PanelDateScroller";

const CONTROL_STYLES =
  "w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--surface-2))] disabled:cursor-not-allowed disabled:opacity-60";

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    await onSubmit({ barberId: selectedBarber, date, reason });
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit} aria-live="polite">
      <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">
        Día libre por barbero
      </h3>
      <PanelDateScroller
        value={date}
        onChange={setDate}
        minDate={new Date().toISOString().slice(0, 10)}
      />

      <div className="space-y-1">
        <label
          htmlFor="day-off-reason"
          className="text-xs text-[rgb(var(--muted))]"
        >
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

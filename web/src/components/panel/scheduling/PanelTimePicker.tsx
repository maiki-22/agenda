"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PanelTimePickerProps {
  value: string;
  onChange: (hhmm: string) => void;
  label: string;
  placeholder?: string;
}

const HOURS = Array.from({ length: 17 }, (_, index) => String(index + 7).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"] as const;

function parseValue(value: string): { hour: string; minute: string } {
  const [hour, minute] = value.split(":");
  if (!hour || !minute) {
    return { hour: "09", minute: "00" };
  }
  return { hour, minute };
}

export function PanelTimePicker({
  value,
  onChange,
  label,
  placeholder = "Selecciona hora",
}: PanelTimePickerProps) {
  const [open, setOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const parsed = parseValue(value);
  const [draftHour, setDraftHour] = useState<string>(parsed.hour);
  const [draftMinute, setDraftMinute] = useState<string>(parsed.minute);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent): void {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(event.target as Node)) return;
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="space-y-2">
      <label className="text-xs text-[rgb(var(--muted))]">{label}</label>
      <button
        type="button"
        onClick={() => {
          const next = parseValue(value);
          setDraftHour(next.hour);
          setDraftMinute(next.minute);
          setOpen((current) => !current);
        }}
        className="flex w-full items-center justify-between rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-left text-sm text-[rgb(var(--fg))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--surface-2))]"
        aria-expanded={open}
      >
        <span>{value || placeholder}</span>
        <Clock3 className="h-4 w-4 text-[rgb(var(--primary))]" />
      </button>

      {open ? (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-3">
          <p className="text-center text-2xl font-semibold text-[rgb(var(--primary))]">
            {draftHour}:{draftMinute}
          </p>

          <div className="mt-3 grid grid-cols-6 gap-2">
            {HOURS.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => {
                  setDraftHour(hour);
                }}
                className={[
                  "rounded-lg border px-2 py-1 text-sm transition-colors duration-200 ease-out",
                  draftHour === hour
                    ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary)/0.15)] text-[rgb(var(--primary))]"
                    : "border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]",
                ].join(" ")}
              >
                {hour}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {MINUTES.map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => {
                  setDraftMinute(minute);
                }}
                className={[
                  "rounded-lg border px-2 py-1 text-sm transition-colors duration-200 ease-out",
                  draftMinute === minute
                    ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary)/0.15)] text-[rgb(var(--primary))]"
                    : "border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]",
                ].join(" ")}
              >
                :{minute}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
              }}
              className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm text-[rgb(var(--fg))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--border))]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(`${draftHour}:${draftMinute}`);
                setOpen(false);
              }}
              className="btn-gold px-3 py-2 text-sm"
            >
              Confirmar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
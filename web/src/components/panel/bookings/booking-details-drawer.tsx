"use client";

import type { BookingItem } from "@/types/panel";
import { STATUS_BADGE, STATUS_LABELS } from "@/types/panel";
import { formatDateShortCL } from "@/lib/datetime/ui-date-format";

interface BookingDetailsDrawerProps {
  booking: BookingItem | null;
  open: boolean;
  onClose: () => void;
}

export function BookingDetailsDrawer({
  booking,
  open,
  onClose,
}: BookingDetailsDrawerProps) {
  if (!open || !booking) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar detalle de reserva"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <aside className="absolute inset-x-0 bottom-0 rounded-t-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-[var(--shadow-strong)] sm:left-auto sm:right-4 sm:top-4 sm:bottom-4 sm:w-[26rem] sm:rounded-3xl sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold">Detalle de reserva</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-2.5 py-1 text-xs font-medium"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="text-[rgb(var(--muted))]">Cliente:</span>{" "}
            {booking.customer_name}
          </p>
          <p>
            <span className="text-[rgb(var(--muted))]">Teléfono:</span>{" "}
            {booking.customer_phone}
          </p>
          <p>
            <span className="text-[rgb(var(--muted))]">Servicio:</span>{" "}
            {booking.service_name}
          </p>
          <p>
            <span className="text-[rgb(var(--muted))]">Barbero:</span>{" "}
            {booking.barber_name}
          </p>
          <p>
            <span className="text-[rgb(var(--muted))]">Fecha:</span>{" "}
            {formatDateShortCL(booking.date)}
          </p>
          <p>
            <span className="text-[rgb(var(--muted))]">Hora:</span>{" "}
            {booking.time}
          </p>
          <p className="flex items-center gap-2 pt-1">
            <span className="text-[rgb(var(--muted))]">Estado:</span>
            <span
              className={`rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_BADGE[booking.status]}`}
            >
              {STATUS_LABELS[booking.status]}
            </span>
          </p>
        </div>
      </aside>
    </div>
  );
}

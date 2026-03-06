"use client";

import { useMemo, useState } from "react";
import { BookingDetailsDrawer } from "@/components/panel/bookings/booking-details-drawer";
import { Button } from "@/components/ui/Button";

import type {
  BookingItem,
  BookingStatus,
  BookingStatusFilter,
  BookingsResponse,
} from "@/types/panel";
import { STATUS_BADGE, STATUS_LABELS } from "@/types/panel";


const CONTROL_STYLES =
  "rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm transition hover:border-[rgb(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] disabled:cursor-not-allowed disabled:opacity-60";


interface BookingsSectionProps {
  bookings: BookingsResponse | null;
  loading: boolean;
  error: string;
  bookingSearch: string;
  bookingStatus: BookingStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: BookingStatusFilter) => void;
  onRetry: () => Promise<void>;
  onUpdateStatus: (id: string, status: BookingStatus) => Promise<void>;
}

export function BookingsSection(props: BookingsSectionProps) {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const selectedBooking = useMemo<BookingItem | null>(
    () =>
      (props.bookings?.items ?? []).find(
        (booking) => booking.id === selectedBookingId,
      ) ?? null,
    [props.bookings?.items, selectedBookingId],
  );

    if (props.error) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5">
        <h2 className="font-semibold">No pudimos cargar las reservas</h2>
        <p className="text-sm text-[rgb(var(--muted))] mt-1">{props.error}</p>
        <Button className="mt-3" variant="secondary" onClick={props.onRetry}>
          Reintentar reservas
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <header className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-semibold">Gestión de reservas</h2>
        <p className="text-xs text-[rgb(var(--muted))] mt-1">
          Acciones rápidas para confirmar/cancelar y detalle completo en drawer.
        </p>
      </header>

      <div className="sticky top-2 z-20 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/95 p-2 backdrop-blur sm:top-3">
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-[1fr_auto]">
          <label htmlFor="booking-search" className="sr-only">
            Buscar reservas por nombre o teléfono
          </label>
          <input
            id="booking-search"
            value={props.bookingSearch}
            onChange={(event) => props.onSearchChange(event.target.value)}
            placeholder="Buscar nombre o teléfono"
            aria-label="Buscar reservas por nombre o teléfono"
            className={CONTROL_STYLES}
          />
          <label htmlFor="booking-status" className="sr-only">
            Filtrar reservas por estado
          </label>
          <select
          <select
            id="booking-status"
            value={props.bookingStatus}
            onChange={(event) =>
              props.onStatusChange(event.target.value as BookingStatusFilter)
            }
            aria-label="Filtrar reservas por estado"
            className={CONTROL_STYLES}
          >
            <option value="all">Todos</option>
            <option value="booked">Reservada</option>
            <option value="needs_confirmation">Por confirmar</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {(props.bookings?.items ?? []).map((booking) => (
          <article
            key={booking.id}
            className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-3 sm:p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{booking.customer_name}</p>
                <p className="text-xs text-[rgb(var(--muted))] mt-0.5">
                  {booking.date} · {booking.time} · {booking.barber_name}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_BADGE[booking.status]}`}
              >
                {STATUS_LABELS[booking.status]}
              </span>
            </div>
            <p className="mt-2 text-xs text-[rgb(var(--muted))]">
              {booking.service_name}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => props.onUpdateStatus(booking.id, "confirmed")}
                disabled={booking.status === "confirmed"}
                className="px-3 py-2 text-xs"
                aria-label={`Confirmar reserva de ${booking.customer_name}`}
              >
                Confirmar
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => props.onUpdateStatus(booking.id, "cancelled")}
                disabled={booking.status === "cancelled"}
                className="px-3 py-2 text-xs"
                aria-label={`Cancelar reserva de ${booking.customer_name}`}
              >
                Cancelar
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setSelectedBookingId(booking.id)}
                className="col-span-2 px-3 py-2 text-xs sm:ml-auto"
                aria-label={`Cancelar reserva de ${booking.customer_name}`}
              >
                Ver detalle
              </Button>
            </div>
          </article>
        ))}
      </div>

      {props.loading ? (
        <p aria-live="polite" className="text-sm text-[rgb(var(--muted))]">
          Cargando reservas...
        </p>
      ) : null}
      {!props.loading && (props.bookings?.items.length ?? 0) === 0 ? (
        <section className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 text-sm text-[rgb(var(--muted))]">
          <p>Sin resultados para los filtros actuales.</p>
          <Button className="mt-3" variant="secondary" onClick={props.onRetry}>
            Reintentar carga
          </Button>
        </section>
      ) : null}

      <BookingDetailsDrawer
        booking={selectedBooking}
        open={selectedBooking !== null}
        onClose={() => setSelectedBookingId(null)}
      />
    </section>
  );
}

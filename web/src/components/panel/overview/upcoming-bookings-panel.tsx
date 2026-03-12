import { CalendarX } from "lucide-react";
import type { BookingItem } from "@/types/panel";

import { StatusBadge } from "./status-badge";

interface UpcomingBookingsPanelProps {
  bookings: BookingItem[];

  loading?: boolean;

  onViewFullAgenda: () => void;
}

const UPCOMING_SKELETON_ROWS = 4;

function formatHourRange(startAt: string, endAt: string): string {
  const formatter = new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "--:-- – --:--";
  }

  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

function UpcomingCardSkeleton() {
  return (
    <li className="surface-card space-y-2 rounded-[var(--card-radius)] p-3">
      <div className="h-5 w-36 rounded-full bg-[rgb(var(--surface-2))] animate-pulse" />
      <div className="h-4 w-52 rounded-lg bg-[rgb(var(--surface-2))] animate-pulse" />
      <div className="h-4 w-40 rounded-lg bg-[rgb(var(--surface-2))] animate-pulse" />
    </li>
  );
}

export function UpcomingBookingsPanel({
  bookings,

  loading = false,

  onViewFullAgenda,
}: UpcomingBookingsPanelProps) {
  const visibleBookings = bookings.slice(0, 5);

  return (
    <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-[rgb(var(--fg))]">
          Próximas citas
        </h2>
      </div>

      {loading ? (
        <ul className="mt-6 space-y-3" aria-label="Cargando próximas citas">
          {Array.from({ length: UPCOMING_SKELETON_ROWS }, (_, index) => (
            <UpcomingCardSkeleton key={index} />
          ))}
        </ul>
      ) : visibleBookings.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-10 text-center">
          <CalendarX
            className="h-9 w-9 text-[rgb(var(--border))]"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-[rgb(var(--muted))]">
            Sin citas próximas
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {visibleBookings.map((booking) => (
            <li
              key={booking.id}
              className="surface-card space-y-1.5 rounded-[var(--card-radius)] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-[rgb(var(--fg))]">
                  {formatHourRange(booking.start_at, booking.end_at)}
                </p>

                <StatusBadge status={booking.status} />
              </div>
              <p className="text-xs text-[rgb(var(--muted))]">
                {booking.customer_name} · {booking.customer_phone}
              </p>
              <p className="text-xs text-[rgb(var(--muted))]">
                {booking.service_name}
              </p>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="mt-6 min-h-11 text-sm font-normal text-[rgb(var(--muted))] transition-colors duration-200 ease-out hover:text-[rgb(var(--fg))]"
        onClick={onViewFullAgenda}
      >
        Ver agenda completa <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

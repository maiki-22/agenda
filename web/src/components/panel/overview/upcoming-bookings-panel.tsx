import type { BookingItem } from "@/types/panel";

import { StatusBadge } from "./status-badge";

type UpcomingFilter = "today" | "all";

interface UpcomingBookingsPanelProps {
  bookings: BookingItem[];
  filter: UpcomingFilter;
  onFilterChange: (filter: UpcomingFilter) => void;
  onViewFullAgenda: () => void;
}

function getTodayInSantiago(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getVisibleBookings(
  bookings: BookingItem[],
  filter: UpcomingFilter,
): BookingItem[] {
  const today = getTodayInSantiago();
  const filtered =
    filter === "today"
      ? bookings.filter((booking) => booking.date === today)
      : bookings;

  return filtered.slice(0, 5);
}

export function UpcomingBookingsPanel({
  bookings,
  filter,
  onFilterChange,
  onViewFullAgenda,
}: UpcomingBookingsPanelProps) {
  const visibleBookings = getVisibleBookings(bookings, filter);

  return (
    <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold">Próximas citas</h2>
        <div className="inline-flex h-11 items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-1">
          <button
            type="button"
            onClick={() => onFilterChange("today")}
            className={`h-9 min-w-20 rounded-full px-4 text-xs font-bold uppercase tracking-wide transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] ${
              filter === "today"
                ? "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))]"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            }`}
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`h-9 min-w-20 rounded-full px-4 text-xs font-bold uppercase tracking-wide transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] ${
              filter === "all"
                ? "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))]"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {visibleBookings.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 py-8 text-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10 text-[rgb(var(--muted))]"
            aria-hidden="true"
          >
            <path
              d="M8 3v2M16 3v2M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm font-bold">Sin citas para este filtro</p>
          <p className="text-xs text-[rgb(var(--muted))]">
            Prueba cambiar entre Hoy y Todos para ver más resultados.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-[96px_minmax(0,1fr)_auto] gap-4 px-1 pb-2 text-xs uppercase tracking-widest text-[rgb(var(--muted))]">
            <p>Hora</p>
            <p>Cliente</p>
            <p>Estado</p>
          </div>
          <div className="divide-y divide-[rgb(var(--border))]">
            {visibleBookings.map((booking) => (
              <div
                key={booking.id}
                className="grid min-h-11 grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-4 px-1 py-3 transition-all duration-150 ease-out hover:bg-[rgb(var(--surface))]"
              >
                <p className="font-mono text-sm font-normal text-[rgb(var(--muted))]">
                  {booking.time}
                </p>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {booking.customer_name}
                  </p>
                  <p className="truncate text-xs text-[rgb(var(--muted))]">
                    {booking.service_name}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className="mt-6 min-h-11 text-sm font-normal text-[rgb(var(--muted))] transition-all duration-150 ease-out hover:text-[rgb(var(--fg))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface-2))]"
        onClick={onViewFullAgenda}
      >
        Ver agenda completa <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

import type { BookingItem } from "@/types/panel";
import { Button } from "@/components/ui/Button";
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
    <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Próximas citas</h2>
        <div className="inline-flex rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-1">
          <button
            type="button"
            onClick={() => onFilterChange("today")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] ${
              filter === "today"
                ? "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))]"
                : "text-[rgb(var(--muted))]"
            }`}
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary-glow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface))] ${
              filter === "all"
                ? "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))]"
                : "text-[rgb(var(--muted))]"
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {visibleBookings.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 text-sm text-[rgb(var(--muted))]">
          No hay citas para este filtro.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
                <th className="py-2 pr-2">Hora</th>
                <th className="py-2 pr-2">Cliente + servicio</th>
                <th className="py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {visibleBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-[rgb(var(--border))]"
                >
                  <td className="py-2.5 pr-2 font-medium">{booking.time}</td>
                  <td className="py-2.5 pr-2">
                    <p className="font-medium">{booking.customer_name}</p>
                    <p className="text-xs text-[rgb(var(--muted))]">
                      {booking.service_name}
                    </p>
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Button
        className="mt-4"
        variant="ghost"
        size="md"
        onClick={onViewFullAgenda}
      >
        Ver agenda completa
      </Button>
    </section>
  );
}

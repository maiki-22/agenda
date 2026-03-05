import type {
  BookingStatus,
  BookingStatusFilter,
  BookingsResponse,
} from "@/types/panel";
import { STATUS_BADGE, STATUS_LABELS } from "@/types/panel";

interface BookingsSectionProps {
  bookings: BookingsResponse | null;
  loading: boolean;
  bookingSearch: string;
  bookingStatus: BookingStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: BookingStatusFilter) => void;
  onUpdateStatus: (id: string, status: BookingStatus) => Promise<void>;
}

export function BookingsSection(props: BookingsSectionProps) {
  return (
    <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 space-y-3 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold">Gestión de reservas</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            value={props.bookingSearch}
            onChange={(event) => props.onSearchChange(event.target.value)}
            placeholder="Buscar por nombre o teléfono"
            className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm"
          />
          <select
            value={props.bookingStatus}
            onChange={(event) => props.onStatusChange(event.target.value as BookingStatusFilter)}
            className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="booked">Reservada</option>
            <option value="needs_confirmation">Por confirmar</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {(props.bookings?.items ?? []).map((booking) => (
          <article key={booking.id} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 sm:p-4 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{booking.customer_name}</p>
                <p className="text-xs text-[rgb(var(--muted))]">{booking.date} · {booking.time} · {booking.barber_name}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_BADGE[booking.status]}`}>
                {STATUS_LABELS[booking.status]}
              </span>
            </div>
            <p className="text-xs text-[rgb(var(--muted))] mt-2">{booking.service_name} · {booking.customer_phone}</p>
            <div className="mt-3">
              <select
                className="w-full sm:w-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-2 py-1.5 text-xs"
                value={booking.status}
                onChange={(event) => props.onUpdateStatus(booking.id, event.target.value as BookingStatus)}
              >
                <option value="booked">Reservada</option>
                <option value="needs_confirmation">Por confirmar</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </article>
        ))}
      </div>

      {props.loading ? <p className="text-sm text-[rgb(var(--muted))]">Cargando reservas...</p> : null}
      {!props.loading && (props.bookings?.items.length ?? 0) === 0 ? (
        <p className="text-sm text-[rgb(var(--muted))]">Sin resultados para los filtros actuales.</p>
      ) : null}
    </section>
  );
}
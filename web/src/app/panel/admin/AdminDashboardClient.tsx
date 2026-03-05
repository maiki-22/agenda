"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Barber = { id: string; name: string; active: boolean };
type WindowOption =
  | "next_7_days"
  | "next_30_days"
  | "last_7_days"
  | "last_30_days";
type BookingStatus =
  | "booked"
  | "needs_confirmation"
  | "confirmed"
  | "cancelled";
type BookingStatusFilter = "all" | BookingStatus;
type SummaryByBarber = {
  barber_id: string;
  barber_name: string;
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
};

type DailySummary = {
  date: string;
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
};

type OverviewResponse = {
  window: WindowOption;
  date_window: { startDate: string; endDate: string };
  totals: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
  rates: { confirmation_rate: number; cancellation_rate: number };
  by_barber: SummaryByBarber[];
  by_date: DailySummary[];
  barbers: Barber[];
  meta: {
    counts: { raw_appointments: number; filtered_appointments: number };
    generated_at: string;
  };
};

type BookingItem = {
  id: string;
  date: string;
  time: string;
  status: BookingStatus;
  customer_name: string;
  customer_phone: string;
  barber_name: string;
  service_name: string;
};

type BookingsResponse = {
  items: BookingItem[];
  page: number;
  pageSize: number;
  total: number;
};

const WINDOW_LABELS: Record<WindowOption, string> = {
  next_7_days: "Próximos 7 días",
  next_30_days: "Próximos 30 días",
  last_7_days: "Últimos 7 días",
  last_30_days: "Últimos 30 días",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  booked: "Reservada",
  needs_confirmation: "Por confirmar",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

const STATUS_BADGE: Record<BookingStatus, string> = {
  booked:
    "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
  needs_confirmation:
    "bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-200",
  confirmed:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-200",
};

export function AdminDashboardClient() {
  const [windowKey, setWindowKey] = useState<WindowOption>("next_7_days");
  const [barberId, setBarberId] = useState<string>("all");
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const [bookings, setBookings] = useState<BookingsResponse | null>(null);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingStatus, setBookingStatus] =
    useState<BookingStatusFilter>("all");
  const [bookingSearch, setBookingSearch] = useState("");

  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const [dayOffDate, setDayOffDate] = useState("");
  const [dayOffReason, setDayOffReason] = useState("");

  const [closedDate, setClosedDate] = useState("");
  const [closedReason, setClosedReason] = useState("");

  const selectedBarber = useMemo(
    () => (barberId === "all" ? "" : barberId),
    [barberId],
  );

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const params = new URLSearchParams({ window: windowKey });
      if (selectedBarber) params.set("barberId", selectedBarber);
      const res = await fetch(`/api/panel/overview?${params.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.error ?? "No se pudo cargar el dashboard");
      setOverview(json as OverviewResponse);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, [windowKey, selectedBarber]);

  const loadBookings = useCallback(async () => {
    if (!overview) return;
    setBookingsLoading(true);
    try {
      const params = new URLSearchParams({
        dateFrom: overview.date_window.startDate,
        dateTo: overview.date_window.endDate,
        page: "1",
        pageSize: "8",
      });
      if (selectedBarber) params.set("barberId", selectedBarber);
      if (bookingStatus !== "all") params.set("status", bookingStatus);
      if (bookingSearch.trim()) params.set("q", bookingSearch.trim());

      const res = await fetch(`/api/panel/bookings?${params.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "No se pudo cargar reservas");
      setBookings(json as BookingsResponse);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setBookingsLoading(false);
    }
  }, [bookingSearch, bookingStatus, overview, selectedBarber]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const send = async (url: string, body: unknown) => {
    setMessage("");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error ?? "No se pudo guardar");
    await loadOverview();
    await loadBookings();
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    setMessage("");
    const res = await fetch(`/api/panel/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error ?? "No se pudo actualizar estado");
    await loadOverview();
    await loadBookings();
  };

  return (
    <main className="page-container py-5 sm:py-8 space-y-5 sm:space-y-6">
      <header className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-6 shadow-[var(--shadow-soft)]">
        <p className="text-[11px] tracking-[0.24em] uppercase text-[rgb(var(--muted))]">
          Panel administrador
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
          Dashboard de gestión
        </h1>
        <p className="text-sm text-[rgb(var(--muted))] mt-2">
          Vista optimizada para móvil, con métricas y acciones en una sola
          pantalla.
        </p>
      </header>

      <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 grid gap-3 sm:grid-cols-3 shadow-[var(--shadow-soft)]">
        <label className="space-y-1 text-sm">
          <span className="text-[rgb(var(--muted))]">Ventana</span>
          <select
            value={windowKey}
            onChange={(e) => setWindowKey(e.target.value as WindowOption)}
            className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2"
          >
            <option value="next_7_days">Próximos 7 días</option>
            <option value="next_30_days">Próximos 30 días</option>
            <option value="last_7_days">Últimos 7 días</option>
            <option value="last_30_days">Últimos 30 días</option>
          </select>
        </label>

        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="text-[rgb(var(--muted))]">Barbero</span>
          <select
            value={barberId}
            onChange={(e) => setBarberId(e.target.value)}
            className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2"
          >
            <option value="all">Todos</option>
            {(overview?.barbers ?? []).map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name} {barber.active ? "" : "(inactivo)"}
              </option>
            ))}
          </select>
        </label>
      </section>

      {overview ? (
        <p className="text-xs rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2.5 text-[rgb(var(--muted))]">
          Ventana: {WINDOW_LABELS[overview.window]} ·{" "}
          {overview.date_window.startDate} → {overview.date_window.endDate} ·
          Registros: {overview.meta.counts.filtered_appointments}/
          {overview.meta.counts.raw_appointments}
        </p>
      ) : null}

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total citas" value={overview?.totals.total ?? 0} />
        <StatCard label="Confirmadas" value={overview?.totals.confirmed ?? 0} />
        <StatCard label="Pendientes" value={overview?.totals.pending ?? 0} />
        <StatCard label="Canceladas" value={overview?.totals.cancelled ?? 0} />
        <StatCard
          label="Tasa confirmación"
          value={`${overview?.rates.confirmation_rate ?? 0}%`}
        />
        <StatCard
          label="Tasa cancelación"
          value={`${overview?.rates.cancellation_rate ?? 0}%`}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <article className="xl:col-span-3 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 shadow-[var(--shadow-soft)]">
          <h2 className="font-semibold mb-3">Citas por día</h2>
          <div className="space-y-2">
            {(overview?.by_date ?? []).slice(0, 10).map((row) => {
              const width = overview?.totals.total
                ? Math.max(
                    6,
                    Math.round((row.total / overview.totals.total) * 100),
                  )
                : 0;
              return (
                <div
                  key={row.date}
                  className="grid grid-cols-[90px_1fr_40px] gap-2 items-center text-xs sm:text-sm"
                >
                  <span className="text-[rgb(var(--muted))]">
                    {row.date.slice(5)}
                  </span>
                  <div className="h-2.5 rounded-full bg-[rgb(var(--surface))] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[rgb(var(--primary))]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-right font-medium">{row.total}</span>
                </div>
              );
            })}
          </div>
        </article>

        <section className="xl:col-span-2 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 shadow-[var(--shadow-soft)]">
          <h2 className="font-semibold mb-3">Desempeño por barbero</h2>
          <div className="space-y-2">
            {(overview?.by_barber ?? []).map((row) => {
              const barber = overview?.barbers.find(
                (b) => b.id === row.barber_id,
              );
              return (
                <article
                  key={row.barber_id}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{row.barber_name}</p>
                    <button
                      onClick={async () => {
                        if (!barber) return;
                        try {
                          const res = await fetch(
                            `/api/panel/barbers/${barber.id}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ active: !barber.active }),
                            },
                          );
                          const json = await res.json();
                          if (!res.ok)
                            throw new Error(
                              json?.error ?? "No se pudo actualizar",
                            );
                          await loadOverview();
                        } catch (error) {
                          setMessage(
                            error instanceof Error
                              ? error.message
                              : "Error inesperado",
                          );
                        }
                      }}
                      className="rounded-xl border border-[rgb(var(--border))] px-2.5 py-1.5 text-xs"
                    >
                      {barber?.active ? "Deshabilitar" : "Habilitar"}
                    </button>
                  </div>
                  <p className="text-xs text-[rgb(var(--muted))] mt-2">
                    Total {row.total} · Confirmadas {row.confirmed} · Pendientes{" "}
                    {row.pending}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </section>

      <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 space-y-3 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">Gestión de reservas</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              placeholder="Buscar por nombre o teléfono"
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm"
            />
            <select
              value={bookingStatus}
              onChange={(e) =>
                setBookingStatus(e.target.value as BookingStatusFilter)
              }
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
          {(bookings?.items ?? []).map((booking) => (
            <article
              key={booking.id}
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 sm:p-4 text-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{booking.customer_name}</p>
                  <p className="text-xs text-[rgb(var(--muted))]">
                    {booking.date} · {booking.time} · {booking.barber_name}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_BADGE[booking.status]}`}
                >
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>
              <p className="text-xs text-[rgb(var(--muted))] mt-2">
                {booking.service_name} · {booking.customer_phone}
              </p>
              <div className="mt-3">
                <select
                  className="w-full sm:w-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-2 py-1.5 text-xs"
                  value={booking.status}
                  onChange={async (e) => {
                    try {
                      await updateBookingStatus(
                        booking.id,
                        e.target.value as BookingStatus,
                      );
                      setMessage("Estado de reserva actualizado");
                    } catch (error) {
                      setMessage(
                        error instanceof Error
                          ? error.message
                          : "Error inesperado",
                      );
                    }
                  }}
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

        {bookingsLoading ? (
          <p className="text-sm text-[rgb(var(--muted))]">
            Cargando reservas...
          </p>
        ) : null}
        {!bookingsLoading && (bookings?.items.length ?? 0) === 0 ? (
          <p className="text-sm text-[rgb(var(--muted))]">
            Sin resultados para los filtros actuales.
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <form
          className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2 shadow-[var(--shadow-soft)]"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!selectedBarber)
              return setMessage("Selecciona un barbero para bloquear horario");
            try {
              await send("/api/panel/barber-blocks", {
                barber_id: selectedBarber,
                date: blockDate,
                start_at: `${blockDate}T${blockStart}:00-03:00`,
                end_at: `${blockDate}T${blockEnd}:00-03:00`,
                reason: blockReason,
              });
              setMessage("Horario bloqueado correctamente");
            } catch (error) {
              setMessage(
                error instanceof Error ? error.message : "Error inesperado",
              );
            }
          }}
        >
          <h3 className="font-semibold">Bloquear horario</h3>
          <input
            type="date"
            value={blockDate}
            onChange={(e) => setBlockDate(e.target.value)}
            className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="time"
              value={blockStart}
              onChange={(e) => setBlockStart(e.target.value)}
              className="rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
              required
            />
            <input
              type="time"
              value={blockEnd}
              onChange={(e) => setBlockEnd(e.target.value)}
              className="rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
              required
            />
          </div>
          <input
            type="text"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="Motivo"
            className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
          />
          <button className="rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] px-3 py-2">
            Guardar
          </button>
        </form>

        <form
          className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2 shadow-[var(--shadow-soft)]"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!selectedBarber)
              return setMessage("Selecciona un barbero para día libre");
            try {
              await send("/api/panel/barber-days-off", {
                barber_id: selectedBarber,
                date: dayOffDate,
                reason: dayOffReason,
              });
              setMessage("Día libre agregado correctamente");
            } catch (error) {
              setMessage(
                error instanceof Error ? error.message : "Error inesperado",
              );
            }
          }}
        >
          <h3 className="font-semibold">Día libre por barbero</h3>
          <input
            type="date"
            value={dayOffDate}
            onChange={(e) => setDayOffDate(e.target.value)}
            className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
            required
          />
          <input
            type="text"
            value={dayOffReason}
            onChange={(e) => setDayOffReason(e.target.value)}
            placeholder="Motivo"
            className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
          />
          <button className="rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] px-3 py-2">
            Guardar
          </button>
        </form>

        <form
          className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2 shadow-[var(--shadow-soft)]"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await send("/api/panel/shop-closed-days", {
                date: closedDate,
                reason: closedReason,
              });
              setMessage("Día cerrado agregado correctamente");
            } catch (error) {
              setMessage(
                error instanceof Error ? error.message : "Error inesperado",
              );
            }
          }}
        >
          <h3 className="font-semibold">Cerrar barbería (día completo)</h3>
          <input
            type="date"
            value={closedDate}
            onChange={(e) => setClosedDate(e.target.value)}
            className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
            required
          />
          <input
            type="text"
            value={closedReason}
            onChange={(e) => setClosedReason(e.target.value)}
            placeholder="Motivo (feriado, imprevisto...)"
            className="w-full rounded-2xl border border-[rgb(var(--border))] px-3 py-2"
          />
          <button className="rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] px-3 py-2">
            Guardar
          </button>
        </form>
      </section>

      {loading && (
        <p className="text-sm text-[rgb(var(--muted))]">Cargando datos...</p>
      )}
      {message && (
        <p className="text-sm rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2">
          {message}
        </p>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-3.5 sm:p-4 shadow-[var(--shadow-soft)]">
      <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--muted))]">
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </article>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings, updateBookingStatus } from "@/services/panel/bookings";
import { getActiveBlocks, type ActiveBlockItem } from "@/services/panel/blocks";
import { formatDateShortCL } from "@/lib/datetime/ui-date-format";
import {
  STATUS_LABELS,
  type Barber,
  type BookingItem,
  type BookingStatus,
} from "@/types/panel";

interface AdminAgendaGridProps {
  date: string;
  view: "day" | "week";
  selectedBarberId: string;
  barbers: Array<Barber>;
}

type QueryError = { message: string; code?: string };

const SLOT_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function addDays(baseDate: string, days: number): string {
  const date = new Date(`${baseDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function toHour(dateTime: string): number {
  return new Date(dateTime).getHours();
}

export function AdminAgendaGrid({
  date,
  view,
  selectedBarberId,
  barbers,
}: AdminAgendaGridProps) {
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(
    null,
  );
  const dateFrom = date;
  const dateTo = view === "week" ? addDays(date, 6) : date;

  const bookingsQuery = useQuery<Array<BookingItem>, QueryError>({
    queryKey: [
      "panel-agenda",
      view,
      dateFrom,
      dateTo,
      selectedBarberId || "all",
    ],
    queryFn: async (): Promise<Array<BookingItem>> => {
      const response = await getBookings({
        dateFrom,
        dateTo,
        barberId: selectedBarberId || undefined,
        status: "all",
        query: "",
        page: 1,
        pageSize: 200,
      });

      if (!response.success) {
        throw {
          message: response.error,
          code: response.code,
        } satisfies QueryError;
      }

      return response.data.items;
    },
    staleTime: 30_000,
  });

  const blocksQuery = useQuery<Array<ActiveBlockItem>, QueryError>({
    queryKey: [
      "panel-agenda-blocks",
      view,
      dateFrom,
      dateTo,
      selectedBarberId || "all",
    ],
    queryFn: async (): Promise<Array<ActiveBlockItem>> => {
      const response = await getActiveBlocks({
        barberId: selectedBarberId || undefined,
      });
      if (!response.success) {
        throw {
          message: response.error,
          code: response.code,
        } satisfies QueryError;
      }
      return response.data.filter(
        (item) => item.date >= dateFrom && item.date <= dateTo,
      );
    },
    staleTime: 30_000,
  });

  const updateMutation = useMutation<
    { ok: boolean },
    QueryError,
    { bookingId: string; status: BookingStatus }
  >({
    mutationFn: async (input): Promise<{ ok: boolean }> => {
      const response = await updateBookingStatus(input.bookingId, input.status);
      if (!response.success) {
        throw {
          message: response.error,
          code: response.code,
        } satisfies QueryError;
      }
      return response.data;
    },
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["panel-agenda"] }),
        queryClient.invalidateQueries({ queryKey: ["panel-bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["panel-overview"] }),
      ]);
    },
  });

  const visibleBarbers = selectedBarberId
    ? barbers.filter((barber) => barber.id === selectedBarberId)
    : barbers;

  const bookingsMap = useMemo(() => {
    const byCell = new Map<string, BookingItem>();
    const sortedBookings = [...(bookingsQuery.data ?? [])].sort(
      (firstBooking, secondBooking) =>
        firstBooking.start_at.localeCompare(secondBooking.start_at),
    );

    for (const booking of sortedBookings) {
      const cellKey = `${booking.barber_name}::${toHour(booking.start_at)}`;
      if (!byCell.has(cellKey)) {
        byCell.set(cellKey, booking);
      }
    }
    return byCell;
  }, [bookingsQuery.data]);

  const hasGlobalClosure = (blocksQuery.data ?? []).some(
    (item) => item.type === "shop-closed",
  );

  if (bookingsQuery.error || blocksQuery.error) {
    return (
      <section className="surface-card p-4 text-red-400">
        <p className="font-semibold">No se pudo cargar la agenda.</p>
        <p className="text-sm">
          {bookingsQuery.error?.message ?? blocksQuery.error?.message}
        </p>
      </section>
    );
  }

  if (bookingsQuery.isLoading || blocksQuery.isLoading) {
    return (
      <div
        className="surface-card h-72 animate-pulse bg-[rgb(var(--surface-2))]"
        aria-label="Cargando agenda"
      />
    );
  }

  return (
    <section className="surface-card relative overflow-x-auto p-3 sm:p-4">
      {hasGlobalClosure && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-red-500/10">
          <p className="rounded-full border border-red-500/30 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300">
            Cierre total del local en el rango seleccionado
          </p>
        </div>
      )}

      <div
        className="grid min-w-[42rem]"
        style={{
          gridTemplateColumns: `84px repeat(${visibleBarbers.length}, minmax(170px, 1fr))`,
        }}
      >
        <div className="border-b border-[rgb(var(--border))] p-2 text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
          Hora
        </div>
        {visibleBarbers.map((barber) => (
          <div
            key={barber.id}
            className="border-b border-l border-[rgb(var(--border))] p-2 text-sm font-semibold text-[rgb(var(--fg))]"
          >
            {barber.name}
          </div>
        ))}

        {SLOT_HOURS.map((slotHour) => (
          <div key={`slot-row-${slotHour}`} className="contents">
            <div className="border-b border-[rgb(var(--border))] p-2 text-xs font-semibold text-[rgb(var(--muted))]">
              {`${String(slotHour).padStart(2, "0")}:00`}
            </div>
            {visibleBarbers.map((barber) => {
              const booking = bookingsMap.get(`${barber.name}::${slotHour}`);

              const isBlocked = (blocksQuery.data ?? []).some(
                (item) =>
                  item.type !== "shop-closed" &&
                  item.barberId === barber.id &&
                  (item.startAt ? toHour(item.startAt) === slotHour : true),
              );

              return (
                <div
                  key={`${barber.id}-${slotHour}`}
                  className="border-b border-l border-[rgb(var(--border))] p-1.5"
                >
                  {booking ? (
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className={`w-full rounded-lg px-2 py-1 text-left text-xs font-semibold ${
                        booking.status === "confirmed"
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border border-[rgb(var(--primary)/0.3)] bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary))]"
                      }`}
                    >
                      {booking.customer_name}
                    </button>
                  ) : isBlocked ? (
                    <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-300">
                      Bloqueado
                    </span>
                  ) : (
                    <span className="text-xs text-[rgb(var(--muted))]">
                      Disponible
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedBooking && (
        <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-[var(--shadow-strong)]">
          <button
            type="button"
            onClick={() => setSelectedBooking(null)}
            className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-1 text-sm"
          >
            Cerrar
          </button>
          <h3 className="mt-4 text-lg font-semibold">Detalle de reserva</h3>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-[rgb(var(--muted))]">Cliente:</span>{" "}
              {selectedBooking.customer_name}
            </p>
            <p>
              <span className="text-[rgb(var(--muted))]">Servicio:</span>{" "}
              {selectedBooking.service_name}
            </p>
            <p>
              <span className="text-[rgb(var(--muted))]">Fecha:</span>{" "}
              {formatDateShortCL(selectedBooking.date)}
            </p>
            <p>
              <span className="text-[rgb(var(--muted))]">Hora:</span>{" "}
              {selectedBooking.time}
            </p>
            <p>
              <span className="text-[rgb(var(--muted))]">Estado:</span>{" "}
              {STATUS_LABELS[selectedBooking.status]}
            </p>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              disabled={updateMutation.isPending}
              onClick={() =>
                updateMutation.mutate({
                  bookingId: selectedBooking.id,
                  status: "confirmed",
                })
              }
              className="btn-gold px-4 py-2 text-sm"
            >
              Confirmar
            </button>
            <button
              type="button"
              disabled={updateMutation.isPending}
              onClick={() =>
                updateMutation.mutate({
                  bookingId: selectedBooking.id,
                  status: "cancelled",
                })
              }
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300"
            >
              Cancelar
            </button>
          </div>
        </aside>
      )}
    </section>
  );
}

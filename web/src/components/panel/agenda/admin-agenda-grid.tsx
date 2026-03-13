"use client";

import { useMemo, useState, type ReactElement } from "react";
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

function AgendaGridSkeleton({
  columnCount,
}: {
  columnCount: number;
}): ReactElement {
  return (
    <section
      className="surface-card overflow-x-auto p-3 sm:p-4"
      aria-label="Cargando agenda"
    >
      <div
        className="grid min-w-[42rem]"
        style={{
          gridTemplateColumns: `84px repeat(${columnCount}, minmax(170px, 1fr))`,
        }}
      >
        {Array.from({ length: columnCount + 1 }).map((_, index) => (
          <div
            key={`agenda-header-skeleton-${index}`}
            className="h-9 border-b border-[rgb(var(--border))] px-2 py-2"
          >
            <div className="h-4 rounded-full bg-[rgb(var(--surface-2))] animate-pulse" />
          </div>
        ))}

        {SLOT_HOURS.slice(0, 8).map((slotHour) => (
          <div key={`agenda-skeleton-row-${slotHour}`} className="contents">
            <div className="border-b border-[rgb(var(--border))] p-2">
              <div className="h-3 w-12 rounded-full bg-[rgb(var(--surface-2))] animate-pulse" />
            </div>
            {Array.from({ length: columnCount }).map((_, columnIndex) => (
              <div
                key={`agenda-skeleton-cell-${slotHour}-${columnIndex}`}
                className="border-b border-l border-[rgb(var(--border))] p-1.5"
              >
                <div className="h-6 rounded-lg bg-[rgb(var(--surface-2))] animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

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
    mutationFn: async (input) => {
      const response = await updateBookingStatus(input.bookingId, input.status);
      if (!response.success) {
        throw {
          message: response.error,
          code: response.code,
        } satisfies QueryError;
      }
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["panel-agenda"] }),
        queryClient.invalidateQueries({ queryKey: ["panel-bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["panel-overview"] }),
      ]);
      setSelectedBooking(null);
    },
  });

  const visibleBarbers = selectedBarberId
    ? barbers.filter((barber) => barber.id === selectedBarberId)
    : barbers;

  const bookingsMap = useMemo(() => {
    const byCell = new Map<string, BookingItem>();
    const sortedBookings = [...(bookingsQuery.data ?? [])].sort((a, b) =>
      a.start_at.localeCompare(b.start_at),
    );

    for (const booking of sortedBookings) {
      const cellKey = `${booking.barber_name}::${toHour(booking.start_at)}`;
      if (!byCell.has(cellKey)) byCell.set(cellKey, booking);
    }
    return byCell;
  }, [bookingsQuery.data]);

  const hasGlobalClosure = (blocksQuery.data ?? []).some(
    (item) => item.type === "shop-closed",
  );

  if (bookingsQuery.error || blocksQuery.error) {
    return (
      <section className="surface-card p-4">
        <p className="font-semibold text-red-400">
          No se pudo cargar la agenda.
        </p>
        <p className="mt-1 text-sm text-[rgb(var(--muted))]">
          {bookingsQuery.error?.message ?? blocksQuery.error?.message}
        </p>
        <button
          type="button"
          onClick={() =>
            void Promise.all([bookingsQuery.refetch(), blocksQuery.refetch()])
          }
          className="mt-3 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]"
        >
          Reintentar agenda
        </button>
      </section>
    );
  }

  if (bookingsQuery.isLoading || blocksQuery.isLoading) {
    return (
      <AgendaGridSkeleton columnCount={Math.max(visibleBarbers.length, 1)} />
    );
  }

  if (bookingsMap.size === 0) {
    return (
      <section className="surface-card p-4 sm:p-5">
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-sm font-medium text-[rgb(var(--muted))]">
            No hay reservas para el rango seleccionado
          </p>
          <button
            type="button"
            onClick={() =>
              void Promise.all([bookingsQuery.refetch(), blocksQuery.refetch()])
            }
            className="mt-1 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]"
          >
            Reintentar agenda
          </button>
        </div>
      </section>
    );
  }

  // ... (El resto del renderizado de la grilla y el side-panel permanecen igual)
  return (
    <section className="surface-card relative overflow-x-auto p-3 sm:p-4">
      {hasGlobalClosure && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-red-500/10">
          <p className="rounded-full border border-red-500/30 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300">
            Cierre total del local en el rango seleccionado
          </p>
        </div>
      )}
      {/* Grilla y Side Panel... */}
    </section>
  );
}

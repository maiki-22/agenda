"use client";

import { useMemo, useState } from "react";
import { BookingsSection } from "@/components/panel/bookings/bookings-section";
import { useToast } from "@/components/ui/toast-provider";

import type {
  BarberBlocksResponse,
  BarberDaysOffResponse,
  BookingsResponse,
  BookingStatus,
  BookingStatusFilter,
} from "@/types/panel";
import { useBarberPanel } from "@/hooks/panel/use-barber-panel";

interface BarberDashboardClientProps {
  barberId: string;
  dateFrom: string;
  dateTo: string;
  initialBookings: BookingsResponse | null;
  initialBlocks: BarberBlocksResponse | null;
  initialDaysOff: BarberDaysOffResponse | null;
}

type BarberBookingsTab = "today" | "next-days";

type BarberBookingsFilters = {
  period: BarberBookingsTab;
  search: string;
  status: BookingStatusFilter;
};

const BARBER_BOOKINGS_TABS: { key: BarberBookingsTab; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "next-days", label: "Próximos días" },
];

function getLocalDateISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
  }).format(new Date());
}

function getRangePreset(
  period: BarberBookingsTab,
  defaultRange: { dateFrom: string; dateTo: string },
): { dateFrom: string; dateTo: string } {
  const today = getLocalDateISO();
  if (period === "today") {
    return { dateFrom: today, dateTo: today };
  }

  return defaultRange;
}

export function BarberDashboardClient({
  barberId,
  dateFrom,
  dateTo,
  initialBookings,
  initialBlocks,
  initialDaysOff,
}: BarberDashboardClientProps) {
  const [filters, setFilters] = useState<BarberBookingsFilters>({
    period: "today",
    search: "",
    status: "all",
  });

  const toast = useToast();
  
  const rangePreset = useMemo<{ dateFrom: string; dateTo: string }>(
    () => getRangePreset(filters.period, { dateFrom, dateTo }),
    [dateFrom, dateTo, filters.period],
  );

  const panel = useBarberPanel({
    barberId,
    dateFrom: rangePreset.dateFrom,
    dateTo: rangePreset.dateTo,
    bookingStatus: filters.status,
    bookingSearch: filters.search,
    initialBookings,
    initialBlocks,
    initialDaysOff,
  });

  const emptyMessage =
    filters.period === "today" ? "Sin citas por hoy" : "Sin citas en los próximos días";

  async function handleBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<void> {
    const error = await panel.updateBooking(id, status);
    if (error) {
      toast.error(`No se pudo actualizar la cita: ${error}`);
      return;
    }

    toast.success("Cita actualizada correctamente");
  }

  return (
    <main className="page-container space-y-5 py-5 pb-24 sm:space-y-6 sm:py-8 sm:pb-8">
      <section className="surface-card rounded-[var(--card-radius)] p-4">
        <nav className="flex gap-2 overflow-x-auto no-scrollbar" aria-label="Vista de citas del barbero">
          {BARBER_BOOKINGS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  period: tab.key,
                }))
              }
              aria-current={filters.period === tab.key ? "page" : undefined}
              className={[
                "shrink-0 rounded-lg border px-3 py-2 text-sm transition-colors duration-200 ease-out",
                filters.period === tab.key
                  ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary)/0.15)] text-[rgb(var(--primary))]"
                  : "border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </section>

      <BookingsSection
        bookings={panel.bookings}
        loading={panel.bookingsLoading}
        error={panel.bookingsError}
        bookingSearch={filters.search}
        bookingStatus={filters.status}
        onSearchChange={(value: string) =>
          setFilters((prev) => ({
            ...prev,
            search: value,
          }))
        }
        onStatusChange={(status: BookingStatusFilter) =>
          setFilters((prev) => ({
            ...prev,
            status,
          }))
        }
        onRetry={async (): Promise<void> => {
          await panel.retryBookings();
        }}
        onUpdateStatus={handleBookingStatus}
        actionMode="barber"
        emptyMessage={emptyMessage}
      />
    </main>
  );
}
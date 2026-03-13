"use client";

import { useMemo, useState } from "react";
import { BookingsSection } from "@/components/panel/bookings/bookings-section";
import { useToast } from "@/components/ui/toast-provider";

import type {
  BarberBlocksResponse,
  BarberDaysOffResponse,
  BookingsResponse,
  BookingStatus,
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

const BARBER_BOOKINGS_TABS: { key: BarberBookingsTab; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "next-days", label: "Próximos días" },
];

function getLocalDateISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
  }).format(new Date());
}

function getFilteredBookings(
  bookings: BookingsResponse | null,
  activeTab: BarberBookingsTab,
): BookingsResponse | null {
  if (!bookings) {
    return null;
  }

  const today = getLocalDateISO();
  const items = bookings.items.filter((booking) =>
    activeTab === "today" ? booking.date === today : booking.date > today,
  );

  return {
    ...bookings,
    items,
    total: items.length,
  };
}

export function BarberDashboardClient({
  barberId,
  dateFrom,
  dateTo,
  initialBookings,
  initialBlocks,
  initialDaysOff,
}: BarberDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<BarberBookingsTab>("today");

  const toast = useToast();
  const panel = useBarberPanel({
    barberId,
    dateFrom,
    dateTo,
    initialBookings,
    initialBlocks,
    initialDaysOff,
  });

  const filteredBookings = useMemo<BookingsResponse | null>(
    () => getFilteredBookings(panel.bookings, activeTab),
    [activeTab, panel.bookings],
  );

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
              onClick={() => setActiveTab(tab.key)}
              aria-current={activeTab === tab.key ? "page" : undefined}
              className={[
                "shrink-0 rounded-lg border px-3 py-2 text-sm transition-colors duration-200 ease-out",
                activeTab === tab.key
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
        bookings={filteredBookings}
        loading={panel.bookingsLoading}
        error={panel.bookingsError}
        bookingSearch=""
        bookingStatus="all"
        onSearchChange={() => undefined}
        onStatusChange={() => undefined}
        onRetry={async (): Promise<void> => {
          await panel.retryBookings();
        }}
        onUpdateStatus={handleBookingStatus}
        actionMode="barber"
      />
    </main>
  );
}
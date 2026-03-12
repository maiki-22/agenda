"use client";

import { useState } from "react";
import { AdminDashboardOperations } from "@/components/panel/admin/admin-dashboard-operations";
import { PanelHeader } from "@/components/panel/panel-header";
import {
  DashboardTabs,
  type DashboardTabKey,
} from "@/components/panel/admin/dashboard-tabs";
import { BookingsSection } from "@/components/panel/bookings/bookings-section";
import { DashboardFilters } from "@/components/panel/overview/overview-filters";
import { DashboardStatsCards } from "@/components/panel/overview/dashboard-stats-cards";
import { UpcomingBookingsPanel } from "@/components/panel/overview/upcoming-bookings-panel";
import { useToast } from "@/components/ui/toast-provider";
import { useBarberBlocks } from "@/hooks/panel/use-barber-blocks";
import { useBookings } from "@/hooks/panel/use-bookings";
import { useDaysOff } from "@/hooks/panel/use-days-off";
import { useOverview } from "@/hooks/panel/use-overview";
import { WINDOW_LABELS } from "@/types/panel";
import type {
  BookingStatus,
  BookingsResponse,
  OverviewResponse,
} from "@/types/panel";

interface AdminDashboardClientProps {
  initialOverview: OverviewResponse | null;
  initialBookings: BookingsResponse | null;
  role: "admin";
}

function SummaryStatsSkeleton() {
  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      aria-label="Cargando indicadores"
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <article
          key={`stats-skeleton-${index}`}
          className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4"
        >
          <div className="h-3 w-24 rounded-full bg-[rgb(var(--surface))] animate-pulse" />
          <div className="mt-3 h-10 w-20 rounded-xl bg-[rgb(var(--surface))] animate-pulse" />
        </article>
      ))}
    </section>
  );
}

function UpcomingBookingsSkeleton() {
  return (
    <section className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5">
      <div className="h-5 w-44 rounded-full bg-[rgb(var(--surface))] animate-pulse" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`booking-skeleton-${index}`}
            className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-4 py-3"
          >
            <div className="h-4 w-14 rounded-full bg-[rgb(var(--surface))] animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-2/3 rounded-full bg-[rgb(var(--surface))] animate-pulse" />
              <div className="h-3 w-1/2 rounded-full bg-[rgb(var(--surface))] animate-pulse" />
            </div>
            <div className="h-6 w-20 rounded-full bg-[rgb(var(--surface))] animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminDashboardClient({
  initialOverview,
  initialBookings,
  role,
}: AdminDashboardClientProps) {
  const toast = useToast();
  const [liveMessage, setLiveMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<DashboardTabKey>("summary");
  const [upcomingFilter, setUpcomingFilter] = useState<"today" | "all">(
    "today",
  );
  const overviewState = useOverview(initialOverview);
  const bookingsState = useBookings({
    overview: overviewState.overview,
    selectedBarber: overviewState.selectedBarber,
    initialBookings,
  });
  const blocksState = useBarberBlocks();
  const daysOffState = useDaysOff();

  async function handleBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<void> {
    const error = await bookingsState.onUpdateBookingStatus(id, status);
    if (error) {
      const message = `No se pudo ${
        status === "confirmed" ? "confirmar" : "cancelar"
      } la reserva: ${error}`;
      toast.error(message);
      setLiveMessage(message);
      return;
    }

    const message =
      status === "confirmed"
        ? "Reserva confirmada correctamente"
        : "Reserva cancelada correctamente";
    toast.success(message);
    setLiveMessage(message);
  }

  return (
    <main className="page-container space-y-5 py-5 pb-24 sm:space-y-6 sm:py-8 sm:pb-8">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>

      <PanelHeader role={role} />

      <DashboardTabs activeTab={activeTab} onChange={setActiveTab} />

      {(activeTab === "summary" || activeTab === "bookings") && (
        <DashboardFilters
          windowKey={overviewState.windowKey}
          barberId={overviewState.barberId}
          barbers={overviewState.overview?.barbers ?? []}
          onWindowChange={overviewState.setWindowKey}
          onBarberChange={overviewState.setBarberId}
        />
      )}

      {activeTab === "summary" && overviewState.overview ? (
        <p className="text-xs rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2.5 text-[rgb(var(--muted))]">
          Ventana: {WINDOW_LABELS[overviewState.overview.window]} ·{" "}
          {overviewState.overview.date_window.startDate} →{" "}
          {overviewState.overview.date_window.endDate} · Registros:{" "}
          {overviewState.overview.meta.counts.filtered_appointments}/
          {overviewState.overview.meta.counts.raw_appointments}
        </p>
      ) : null}

      {activeTab === "summary" ? (
        <section className="space-y-3">
          {overviewState.error ? (
            <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
              <h2 className="font-semibold">No se pudo cargar el resumen</h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                {overviewState.error}
              </p>
            </section>
          ) : null}

          {overviewState.loading || bookingsState.loading ? (
            <SummaryStatsSkeleton />
          ) : (
            <DashboardStatsCards
              bookings={bookingsState.bookings?.items ?? []}
            />
          )}

          {bookingsState.error ? (
            <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
              <h2 className="font-semibold">
                No se pudieron cargar las próximas citas
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                {bookingsState.error}
              </p>
            </section>
          ) : bookingsState.loading ? (
            <UpcomingBookingsSkeleton />
          ) : (
            <UpcomingBookingsPanel
              bookings={bookingsState.bookings?.items ?? []}
              filter={upcomingFilter}
              onFilterChange={setUpcomingFilter}
              onViewFullAgenda={() => setActiveTab("bookings")}
            />
          )}
        </section>
      ) : null}

      {activeTab === "bookings" ? (
        <BookingsSection
          bookings={bookingsState.bookings}
          loading={bookingsState.loading}
          error={bookingsState.error}
          bookingSearch={bookingsState.bookingSearch}
          bookingStatus={bookingsState.bookingStatus}
          onRetry={bookingsState.reloadBookings}
          onSearchChange={bookingsState.setBookingSearch}
          onStatusChange={bookingsState.setBookingStatus}
          onUpdateStatus={handleBookingStatus}
        />
      ) : null}

      {activeTab === "operations" ? (
        <AdminDashboardOperations
          selectedBarber={overviewState.selectedBarber}
          blocksState={blocksState}
          daysOffState={daysOffState}
          toast={toast}
          setLiveMessage={setLiveMessage}
        />
      ) : null}
    </main>
  );
}

"use client";

import { useState } from "react";
import { AdminDashboardOperations } from "@/components/panel/admin/admin-dashboard-operations";
import {
  DashboardTabs,
  type DashboardTabKey,
} from "@/components/panel/admin/dashboard-tabs";
import { BookingsSection } from "@/components/panel/bookings/bookings-section";
import { OverviewBreakdown } from "@/components/panel/overview/overview-breakdown";
import { OverviewFilters } from "@/components/panel/overview/overview-filters";
import { OverviewSummary } from "@/components/panel/overview/overview-summary";
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
}

export function AdminDashboardClient({
  initialOverview,
  initialBookings,
}: AdminDashboardClientProps) {
  const toast = useToast();
  const [liveMessage, setLiveMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<DashboardTabKey>("summary");
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
    <main className="page-container py-5 sm:py-8 space-y-5 sm:space-y-6">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>

      <header className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-6 shadow-[var(--shadow-soft)]">
        <p className="text-[11px] tracking-[0.24em] uppercase text-[rgb(var(--muted))]">
          Panel administrador
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
          La Sucursal Dashboard
        </h1>
      </header>

      <DashboardTabs activeTab={activeTab} onChange={setActiveTab} />

      {(activeTab === "summary" || activeTab === "bookings") && (
        <OverviewFilters
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
        <>
          <OverviewSummary
            overview={overviewState.overview}
            error={overviewState.error}
            onRetry={overviewState.reloadOverview}
          />
          <OverviewBreakdown
            overview={overviewState.overview}
            error={overviewState.error}
            onRetry={overviewState.reloadOverview}
            onToggleBarberStatus={overviewState.onToggleBarberStatus}
            onFeedback={(message, type) => {
              if (type === "error") {
                toast.error(message);
              } else {
                toast.success(message);
              }
              setLiveMessage(message);
            }}
          />
        </>
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

"use client";

import { useMemo, useState } from "react";
import { CollapsiblePanelCard } from "@/components/panel/admin/collapsible-panel-card";
import {
  DashboardTabs,
  type DashboardTabKey,
} from "@/components/panel/admin/dashboard-tabs";
import { BookingsSection } from "@/components/panel/bookings/bookings-section";
import { OverviewBreakdown } from "@/components/panel/overview/overview-breakdown";
import { OverviewFilters } from "@/components/panel/overview/overview-filters";
import { OverviewSummary } from "@/components/panel/overview/overview-summary";
import { BarberBlockForm } from "@/components/panel/scheduling/barber-block-form";
import { DayOffForm } from "@/components/panel/scheduling/day-off-form";
import { ShopClosedForm } from "@/components/panel/scheduling/shop-closed-form";
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
  const [message, setMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<DashboardTabKey>("summary");
  const overviewState = useOverview(initialOverview);
  const bookingsState = useBookings({
    overview: overviewState.overview,
    selectedBarber: overviewState.selectedBarber,
    initialBookings,
  });
  const blocksState = useBarberBlocks();
  const daysOffState = useDaysOff();

  const mergedError = useMemo(
    () => message || overviewState.error || bookingsState.error,
    [bookingsState.error, message, overviewState.error],
  );

  async function handleBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<void> {
    const error = await bookingsState.onUpdateBookingStatus(id, status);
    if (error) return setMessage(error);

    setMessage("Estado de reserva actualizado");
  }

  return (
    <main className="page-container py-5 sm:py-8 space-y-5 sm:space-y-6">
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
          <OverviewSummary overview={overviewState.overview} />
          <OverviewBreakdown
            overview={overviewState.overview}
            onToggleBarberStatus={async (barberId, active) => {
              const error = await overviewState.onToggleBarberStatus(
                barberId,
                active,
              );
              if (error) setMessage(error);
            }}
          />
        </>
      ) : null}

      {activeTab === "bookings" ? (
        <BookingsSection
          bookings={bookingsState.bookings}
          loading={bookingsState.loading}
          bookingSearch={bookingsState.bookingSearch}
          bookingStatus={bookingsState.bookingStatus}
          onSearchChange={bookingsState.setBookingSearch}
          onStatusChange={bookingsState.setBookingStatus}
          onUpdateStatus={handleBookingStatus}
        />
      ) : null}

      {activeTab === "operations" ? (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <CollapsiblePanelCard
            title="Bloquear horario"
            description="Reservá bloques para pausas o eventos puntuales."
            primaryActionLabel="Crear bloqueo"
            defaultOpen
          >
            <BarberBlockForm
              selectedBarber={overviewState.selectedBarber}
              loading={blocksState.loading}
              onSubmit={async (input) => {
                if (!overviewState.selectedBarber) {
                  return setMessage(
                    "Selecciona un barbero para bloquear horario",
                  );
                }
                const error = await blocksState.submitBlock(input);
                if (error) return setMessage(error);
                setMessage("Horario bloqueado correctamente");
              }}
            />
          </CollapsiblePanelCard>
          <CollapsiblePanelCard
            title="Día libre"
            description="Configurá ausencias de barberos por día completo."
            primaryActionLabel="Agregar día libre"
          >
            <DayOffForm
              selectedBarber={overviewState.selectedBarber}
              loading={daysOffState.loading}
              onSubmit={async (input) => {
                if (!overviewState.selectedBarber) {
                  return setMessage("Selecciona un barbero para día libre");
                }
                const error = await daysOffState.submitBarberDayOff(input);
                if (error) return setMessage(error);
                setMessage("Día libre agregado correctamente");
              }}
            />
          </CollapsiblePanelCard>
          <CollapsiblePanelCard
            title="Cierre general"
            description="Marcá días cerrados para toda la barbería."
            primaryActionLabel="Cerrar día"
          >
            <ShopClosedForm
              loading={daysOffState.loading}
              onSubmit={async (input) => {
                const error = await daysOffState.submitShopClosedDay(input);
                if (error) return setMessage(error);
                setMessage("Día cerrado agregado correctamente");
              }}
            />
          </CollapsiblePanelCard>
        </section>
      ) : null}

      {overviewState.loading ? (
        <p className="text-sm text-[rgb(var(--muted))]">Cargando datos...</p>
      ) : null}
      {mergedError ? (
        <p className="text-sm rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2">
          {mergedError}
        </p>
      ) : null}
    </main>
  );
}

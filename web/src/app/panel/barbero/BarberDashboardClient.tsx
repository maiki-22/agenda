"use client";

import { type ReactNode, useState } from "react";
import {
  DashboardTabs,
  type DashboardTabKey,
} from "@/components/panel/admin/dashboard-tabs";
import { BookingsSection } from "@/components/panel/bookings/bookings-section";
import { DashboardStatsCards } from "@/components/panel/overview/dashboard-stats-cards";
import { UpcomingBookingsPanel } from "@/components/panel/overview/upcoming-bookings-panel";
import { BarberBlockForm } from "@/components/panel/scheduling/barber-block-form";
import { DayOffForm } from "@/components/panel/scheduling/day-off-form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast-provider";
import { useBarberPanel } from "@/hooks/panel/use-barber-panel";
import { formatDateShortCL } from "@/lib/datetime/ui-date-format";

import type {
  BarberBlocksResponse,
  BarberDaysOffResponse,
  BookingStatus,
  BookingsResponse,
} from "@/types/panel";

interface BarberDashboardClientProps {
  barberId: string;
  dateFrom: string;
  dateTo: string;
  initialBookings: BookingsResponse | null;
  initialBlocks: BarberBlocksResponse | null;
  initialDaysOff: BarberDaysOffResponse | null;
}

export function BarberDashboardClient({
  barberId,
  dateFrom,
  dateTo,
  initialBookings,
  initialBlocks,
  initialDaysOff,
}: BarberDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>("summary");
  const [upcomingFilter, setUpcomingFilter] = useState<"today" | "all">(
    "today",
  );
  const toast = useToast();
  const panel = useBarberPanel({
    barberId,
    dateFrom,
    dateTo,
    initialBookings,
    initialBlocks,
    initialDaysOff,
  });

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
      <DashboardTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "summary" ? (
        <section className="space-y-3">
          <DashboardStatsCards bookings={panel.bookings?.items ?? []} />
          <UpcomingBookingsPanel
            bookings={panel.bookings?.items ?? []}
            filter={upcomingFilter}
            onFilterChange={setUpcomingFilter}
            onViewFullAgenda={() => setActiveTab("bookings")}
          />
        </section>
      ) : null}

      {activeTab === "bookings" ? (
        <BookingsSection
          bookings={panel.bookings}
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
        />
      ) : null}

      {activeTab === "operations" ? (
        <section className="space-y-4">
          <BarberBlockForm
            selectedBarber={barberId}
            loading={panel.schedulingLoading}
            onSubmit={async (input): Promise<void> => {
              const error = await panel.createBlock(input);
              if (error) {
                toast.error(`No se pudo crear el bloqueo: ${error}`);
                return;
              }
              toast.success("Bloqueo creado correctamente");
            }}
          />

          <ModuleState
            title="Bloqueos próximos"
            loading={panel.blocksLoading}
            error={panel.blocksError}
            empty={panel.blocks.length === 0}
            onRetry={async (): Promise<void> => {
              await panel.retryBlocks();
            }}
          >
            <ul className="space-y-2">
              {panel.blocks.map((block) => (
                <li
                  key={block.id}
                  className="rounded-2xl border border-[rgb(var(--border))] p-3 text-sm"
                >
                  {formatDateShortCL(block.date)} · {block.start_at.slice(11, 16)}-
                  {block.end_at.slice(11, 16)}
                </li>
              ))}
            </ul>
          </ModuleState>

          <DayOffForm
            selectedBarber={barberId}
            loading={panel.schedulingLoading}
            onSubmit={async (input): Promise<void> => {
              const error = await panel.createDayOff(input);
              if (error) {
                toast.error(`No se pudo crear el día libre: ${error}`);
                return;
              }
              toast.success("Día libre creado correctamente");
            }}
          />

          <ModuleState
            title="Días libres registrados"
            loading={panel.daysOffLoading}
            error={panel.daysOffError}
            empty={panel.daysOff.length === 0}
            onRetry={async (): Promise<void> => {
              await panel.retryDaysOff();
            }}
          >
            <ul className="space-y-2">
              {panel.daysOff.map((dayOff) => (
                <li
                  key={dayOff.id}
                  className="rounded-2xl border border-[rgb(var(--border))] p-3 text-sm"
                >
                  {formatDateShortCL(dayOff.date)}{" "}
                  {dayOff.reason ? `· ${dayOff.reason}` : ""}
                </li>
              ))}
            </ul>
          </ModuleState>
        </section>
      ) : null}
    </main>
  );
}

interface ModuleStateProps {
  title: string;
  loading: boolean;
  error: string;
  empty: boolean;
  onRetry: () => Promise<void>;
  children: ReactNode;
}

function ModuleState({
  title,
  loading,
  error,
  empty,
  onRetry,
  children,
}: ModuleStateProps) {
  if (loading) {
    return (
      <p className="text-sm text-[rgb(var(--muted))]">
        Cargando {title.toLowerCase()}...
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
        <p className="font-medium">Error al cargar {title.toLowerCase()}</p>
        <p className="text-sm text-[rgb(var(--muted))]">{error}</p>
        <Button className="mt-3" variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (empty) {
    return (
      <p className="text-sm text-[rgb(var(--muted))]">
        No hay {title.toLowerCase()}.
      </p>
    );
  }

  return children;
}
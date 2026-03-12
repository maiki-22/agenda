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
import { ScheduleEditor } from "@/components/panel/scheduling/schedule-editor";
import { ShopClosedForm } from "@/components/panel/scheduling/shop-closed-form";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast-provider";
import { formatDateShortCL } from "@/lib/datetime/ui-date-format";
import { createShopClosedDay } from "@/services/panel/scheduling";

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

type OperationsTab = "block" | "day-off" | "shop-closed";

const OPERATION_TABS: { key: OperationsTab; label: string }[] = [
  { key: "block", label: "Bloquear horario" },
  { key: "day-off", label: "Día libre" },
  { key: "shop-closed", label: "Cierre general" },
];

export function BarberDashboardClient({
  barberId,
  dateFrom,
  dateTo,
  initialBookings,
  initialBlocks,
  initialDaysOff,
}: BarberDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>("summary");
  const [operationsTab, setOperationsTab] = useState<OperationsTab>("block");
  const [clearVersion, setClearVersion] = useState<number>(0);

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
            loading={panel.bookingsLoading}
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
          <div className="surface-card rounded-[var(--card-radius)] p-4">
            <header className="mb-4 border-b border-[rgb(var(--border))]">
              <nav className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                {OPERATION_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setOperationsTab(tab.key);
                    }}
                    className={[
                      "shrink-0 rounded-lg border px-3 py-2 text-sm transition-colors duration-200 ease-out",
                      operationsTab === tab.key
                        ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary)/0.15)] text-[rgb(var(--primary))]"
                        : "border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </header>

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">
                {OPERATION_TABS.find((tab) => tab.key === operationsTab)?.label}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setClearVersion((current) => current + 1);
                }}
                className="text-xs font-medium text-[rgb(var(--primary))]"
              >
                Limpiar
              </button>
            </div>

            {operationsTab === "block" ? (
              <BarberBlockForm
                key={`barber-block-${clearVersion}`}
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
            ) : null}

            {operationsTab === "day-off" ? (
              <DayOffForm
                key={`barber-day-off-${clearVersion}`}
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
            ) : null}

            {operationsTab === "shop-closed" ? (
              <ShopClosedForm
                key={`barber-shop-closed-${clearVersion}`}
                loading={panel.schedulingLoading}
                onSubmit={async (input): Promise<void> => {
                  const result = await createShopClosedDay(input);
                  if (!result.success) {
                    toast.error(`No se pudo crear el cierre general: ${result.error}`);
                    return;
                  }
                  toast.success("Cierre general creado correctamente");
                }}
              />
            ) : null}
          </div>

          <ScheduleEditor key={barberId} barberId={barberId} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="surface-card rounded-[var(--card-radius)] p-5">
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
                      className="rounded-lg border border-[rgb(var(--border))] p-3 text-sm"
                    >
                      {formatDateShortCL(block.date)} · {block.start_at.slice(11, 16)}-
                      {block.end_at.slice(11, 16)}
                    </li>
                  ))}
                </ul>
              </ModuleState>
            </div>

            <div className="surface-card rounded-[var(--card-radius)] p-5">
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
                      className="rounded-lg border border-[rgb(var(--border))] p-3 text-sm"
                    >
                      {formatDateShortCL(dayOff.date)} {dayOff.reason ? `· ${dayOff.reason}` : ""}
                    </li>
                  ))}
                </ul>
              </ModuleState>
            </div>
          </div>
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
    return <p className="text-sm text-[rgb(var(--muted))]">Cargando {title.toLowerCase()}...</p>;
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
    return <p className="text-sm text-[rgb(var(--muted))]">No hay {title.toLowerCase()}.</p>;
  }

  return children;
}
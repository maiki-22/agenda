"use client";

import { type ReactNode, useState } from "react";
import { BookingsSection } from "@/components/panel/bookings/bookings-section";
import { PanelHeader } from "@/components/panel/panel-header";
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

type BarberTab = "citas" | "bloqueos" | "dias-libres";

interface BarberDashboardClientProps {
  barberId: string;
  dateFrom: string;
  dateTo: string;
  initialBookings: BookingsResponse | null;
  initialBlocks: BarberBlocksResponse | null;
  initialDaysOff: BarberDaysOffResponse | null;
  role: "barber";
}

export function BarberDashboardClient({
  barberId,
  dateFrom,
  dateTo,
  initialBookings,
  initialBlocks,
  initialDaysOff,
  role,
}: BarberDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<BarberTab>("citas");
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
    <main className="page-container py-5 sm:py-8 space-y-5 sm:space-y-6">
      <PanelHeader role={role} />

      <nav
        className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-1.5 shadow-[var(--shadow-soft)]"
        aria-label="Secciones de barbero"
      >
        <ul className="grid grid-cols-3 gap-1">
          {[
            ["citas", "Citas"],
            ["bloqueos", "Bloqueos"],
            ["dias-libres", "Días libres"],
          ].map(([key, label]) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => setActiveTab(key as BarberTab)}
                className={`w-full rounded-2xl px-3 py-2 text-xs sm:text-sm font-medium transition ${
                  activeTab === key
                    ? "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))]"
                    : "text-[rgb(var(--muted))]"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {activeTab === "citas" ? (
        <BookingsSection
          bookings={panel.bookings}
          loading={panel.bookingsLoading}
          error={panel.bookingsError}
          bookingSearch=""
          bookingStatus="all"
          onSearchChange={() => undefined}
          onStatusChange={() => undefined}
          onRetry={async () => {
            await panel.retryBookings();
          }}
          onUpdateStatus={handleBookingStatus}
        />
      ) : null}

      {activeTab === "bloqueos" ? (
        <section className="space-y-4">
          <BarberBlockForm
            selectedBarber={barberId}
            loading={panel.schedulingLoading}
            onSubmit={async (input) => {
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
            onRetry={async () => {
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
        </section>
      ) : null}

      {activeTab === "dias-libres" ? (
        <section className="space-y-4">
          <DayOffForm
            selectedBarber={barberId}
            loading={panel.schedulingLoading}
            onSubmit={async (input) => {
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
            onRetry={async () => {
              await panel.retryDaysOff();
            }}
          >
            <ul className="space-y-2">
              {panel.daysOff.map((dayOff) => (
                <li
                  key={dayOff.id}
                  className="rounded-2xl border border-[rgb(var(--border))] p-3 text-sm"
                >
                  {formatDateShortCL(dayOff.date)} {dayOff.reason ? `· ${dayOff.reason}` : ""}
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
  if (loading)
    return (
      <p className="text-sm text-[rgb(var(--muted))]">
        Cargando {title.toLowerCase()}...
      </p>
    );
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
  if (empty)
    return (
      <p className="text-sm text-[rgb(var(--muted))]">
        No hay {title.toLowerCase()}.
      </p>
    );
  return children;
}

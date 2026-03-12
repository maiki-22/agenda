"use client";

import { BarberPills } from "@/components/panel/overview/barber-pills";
import { ScheduleEditor } from "@/components/panel/scheduling/schedule-editor";
import { BarberBlockForm } from "@/components/panel/scheduling/barber-block-form";
import { DayOffForm } from "@/components/panel/scheduling/day-off-form";
import { ShopClosedForm } from "@/components/panel/scheduling/shop-closed-form";
import type { useBarberBlocks } from "@/hooks/panel/use-barber-blocks";
import type { useDaysOff } from "@/hooks/panel/use-days-off";
import type { useToast } from "@/components/ui/toast-provider";
import type { Barber } from "@/types/panel";

type BlocksState = ReturnType<typeof useBarberBlocks>;
type DaysOffState = ReturnType<typeof useDaysOff>;
type ToastState = ReturnType<typeof useToast>;

interface AdminDashboardOperationsProps {
  barbers: Barber[];
  selectedBarber: string;
  onSelectBarber: (barberId: string) => void;
  blocksState: BlocksState;
  daysOffState: DaysOffState;
  toast: ToastState;
  setLiveMessage: (message: string) => void;
}

export function AdminDashboardOperations({
  barbers,
  selectedBarber,
  onSelectBarber,
  blocksState,
  daysOffState,
  toast,
  setLiveMessage,
}: AdminDashboardOperationsProps) {
  const notifyError = (message: string): void => {
    toast.error(message);
    setLiveMessage(message);
  };

  const notifySuccess = (message: string): void => {
    toast.success(message);
    setLiveMessage(message);
  };

  return (
    <section className="space-y-4">
      <div className="surface-card rounded-[var(--card-radius)] p-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
          Barbero
        </p>
        <BarberPills
          barbers={barbers}
          value={selectedBarber}
          includeAll={false}
          onChange={onSelectBarber}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="surface-card rounded-[var(--card-radius)] p-4 sm:col-span-2">
          <section>
            <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">
              Bloquear horario
            </h3>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Reservá bloques para pausas o eventos puntuales.
            </p>
            <div className="mt-4">
              <BarberBlockForm
                selectedBarber={selectedBarber}
                loading={blocksState.loading}
                onSubmit={async (input) => {
                  if (!selectedBarber) {
                    notifyError("Selecciona un barbero para bloquear horario");
                    return;
                  }

                  const error = await blocksState.submitBlock(input);
                  if (error) {
                    notifyError(`No se pudo bloquear el horario: ${error}`);
                    return;
                  }

                  notifySuccess("Horario bloqueado correctamente");
                }}
              />
            </div>
          </section>

          <section className="mt-4 border-t border-[rgb(var(--border))] pt-4">
            <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">
              Día libre
            </h3>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Configurá ausencias de barberos por día completo.
            </p>
            <div className="mt-4">
              <DayOffForm
                selectedBarber={selectedBarber}
                loading={daysOffState.loading}
                onSubmit={async (input) => {
                  if (!selectedBarber) {
                    notifyError("Selecciona un barbero para día libre");
                    return;
                  }

                  const error = await daysOffState.submitBarberDayOff(input);
                  if (error) {
                    notifyError(`No se pudo agregar el día libre: ${error}`);
                    return;
                  }

                  notifySuccess("Día libre agregado correctamente");
                }}
              />
            </div>
          </section>

          <section className="mt-4 border-t border-[rgb(var(--border))] pt-4">
            <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">
              Cierre general
            </h3>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">
              Marcá días cerrados para toda la barbería.
            </p>
            <div className="mt-4">
              <ShopClosedForm
                loading={daysOffState.loading}
                onSubmit={async (input) => {
                  const error = await daysOffState.submitShopClosedDay(input);
                  if (error) {
                    notifyError(`No se pudo crear el cierre general: ${error}`);
                    return;
                  }

                  notifySuccess("Día cerrado agregado correctamente");
                }}
              />
            </div>
          </section>
        </div>

        {selectedBarber ? (
          <div className="sm:col-span-2">
            <ScheduleEditor key={selectedBarber} barberId={selectedBarber} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

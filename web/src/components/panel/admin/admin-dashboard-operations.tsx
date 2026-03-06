"use client";

import { CollapsiblePanelCard } from "@/components/panel/admin/collapsible-panel-card";
import { BarberBlockForm } from "@/components/panel/scheduling/barber-block-form";
import { DayOffForm } from "@/components/panel/scheduling/day-off-form";
import { ShopClosedForm } from "@/components/panel/scheduling/shop-closed-form";
import type { useBarberBlocks } from "@/hooks/panel/use-barber-blocks";
import type { useDaysOff } from "@/hooks/panel/use-days-off";
import type { useToast } from "@/components/ui/toast-provider";

type BlocksState = ReturnType<typeof useBarberBlocks>;
type DaysOffState = ReturnType<typeof useDaysOff>;
type ToastState = ReturnType<typeof useToast>;

interface AdminDashboardOperationsProps {
  selectedBarber: string;
  blocksState: BlocksState;
  daysOffState: DaysOffState;
  toast: ToastState;
  setLiveMessage: (message: string) => void;
}

export function AdminDashboardOperations({
  selectedBarber,
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
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <CollapsiblePanelCard
        title="Bloquear horario"
        description="Reservá bloques para pausas o eventos puntuales."
        primaryActionLabel="Crear bloqueo"
        defaultOpen
      >
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
      </CollapsiblePanelCard>

      <CollapsiblePanelCard
        title="Día libre"
        description="Configurá ausencias de barberos por día completo."
        primaryActionLabel="Agregar día libre"
      >
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
            if (error) {
              notifyError(`No se pudo crear el cierre general: ${error}`);
              return;
            }

            notifySuccess("Día cerrado agregado correctamente");
          }}
        />
      </CollapsiblePanelCard>
    </section>
  );
}

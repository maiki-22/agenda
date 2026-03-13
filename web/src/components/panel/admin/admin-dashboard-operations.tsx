"use client";

import { BarberPills } from "@/components/panel/overview/barber-pills";
import { ActiveBlocksList } from "@/components/panel/blocks/active-blocks-list";
import { BlocksForm } from "@/components/panel/blocks/blocks-form";
import { ScheduleEditor } from "@/components/panel/scheduling/schedule-editor";
import { usePanelBlocks } from "@/hooks/panel/use-panel-blocks";
import type { useToast } from "@/components/ui/toast-provider";
import type { Barber } from "@/types/panel";

type ToastState = ReturnType<typeof useToast>;

interface AdminDashboardOperationsProps {
  barbers: Barber[];
  selectedBarber: string;
  onSelectBarber: (barberId: string) => void;
  toast: ToastState;
  setLiveMessage: (message: string) => void;
}

export function AdminDashboardOperations({
  barbers,
  selectedBarber,
  onSelectBarber,
  toast,
  setLiveMessage,
}: AdminDashboardOperationsProps) {
  const blocksState = usePanelBlocks(selectedBarber);

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

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card rounded-[var(--card-radius)] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[rgb(var(--fg))]">Crear bloqueo</h3>
          <BlocksForm
            barbers={barbers}
            selectedBarber={selectedBarber}
            loading={blocksState.saving}
            onSave={async (values): Promise<void> => {
              const error = await blocksState.saveBlock(values);
              if (error) {
                notifyError(`No se pudo guardar: ${error}`);
                return;
              }
              notifySuccess("Bloqueo guardado correctamente");
            }}
          />
        </div>

        <div className="surface-card rounded-[var(--card-radius)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">Bloqueos activos</h3>
            <button
              type="button"
              onClick={(): void => {
                void blocksState.reloadBlocks();
              }}
              className="text-xs font-medium text-[rgb(var(--primary))]"
            >
              Recargar
            </button>
          </div>

          <ActiveBlocksList
            items={blocksState.blocks}
            barbers={barbers}
            loading={blocksState.loading}
            error={blocksState.error}
            deleting={blocksState.deleting}
            onRetry={blocksState.reloadBlocks}
            onDelete={async (values): Promise<void> => {
              const error = await blocksState.removeBlock(values);
              if (error) {
                notifyError(`No se pudo eliminar: ${error}`);
                return;
              }
              notifySuccess("Bloqueo eliminado");
            }}
          />
        </div>
      </div>

      {selectedBarber ? (
        <ScheduleEditor key={selectedBarber} barberId={selectedBarber} />
      ) : null}
    </section>
  );
}
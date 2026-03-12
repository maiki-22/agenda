"use client";

import { useState } from "react";
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
type OperationTab = "block" | "day-off" | "shop-closed";

interface AdminDashboardOperationsProps {
  barbers: Barber[];
  selectedBarber: string;
  onSelectBarber: (barberId: string) => void;
  blocksState: BlocksState;
  daysOffState: DaysOffState;
  toast: ToastState;
  setLiveMessage: (message: string) => void;
}

const OPERATION_TABS: { key: OperationTab; label: string }[] = [
  { key: "block", label: "Bloquear horario" },
  { key: "day-off", label: "Día libre" },
  { key: "shop-closed", label: "Cierre general" },
];

export function AdminDashboardOperations({
  barbers,
  selectedBarber,
  onSelectBarber,
  blocksState,
  daysOffState,
  toast,
  setLiveMessage,
}: AdminDashboardOperationsProps) {
  const [activeTab, setActiveTab] = useState<OperationTab>("block");
  const [clearVersion, setClearVersion] = useState<number>(0);

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

      <div className="surface-card rounded-[var(--card-radius)] p-4">
        <header className="mb-4 border-b border-[rgb(var(--border))]">
          <nav className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
            {OPERATION_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                }}
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
        </header>

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[rgb(var(--fg))]">
            {OPERATION_TABS.find((tab) => tab.key === activeTab)?.label}
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

        {activeTab === "block" ? (
          <BarberBlockForm
            key={`block-${clearVersion}`}
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
        ) : null}

        {activeTab === "day-off" ? (
          <DayOffForm
            key={`day-off-${clearVersion}`}
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
        ) : null}

        {activeTab === "shop-closed" ? (
          <ShopClosedForm
            key={`shop-closed-${clearVersion}`}
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
        ) : null}
      </div>

      {selectedBarber ? <ScheduleEditor key={selectedBarber} barberId={selectedBarber} /> : null}
    </section>
  );
}
"use client";

import { Building2, CalendarMinus2, Clock3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ActiveBlockItem, PanelBlockType } from "@/services/panel/blocks";
import type { Barber } from "@/types/panel";

const TYPE_UI: Record<PanelBlockType, { label: string; icon: typeof Building2 }> = {
  "shop-closed": { label: "Cierre local", icon: Building2 },
  "barber-day-off": { label: "Día libre", icon: CalendarMinus2 },
  "barber-block": { label: "Franja", icon: Clock3 },
};

interface ActiveBlocksListProps {
  items: Array<ActiveBlockItem>;
  barbers: Array<Barber>;
  loading: boolean;
  deleting: boolean;
  onDelete: (input: { id: string; type: PanelBlockType }) => Promise<void>;
}

function resolveBarberName(barbers: Array<Barber>, barberId: string | null): string {
  if (!barberId) return "Todo el local";
  return barbers.find((barber) => barber.id === barberId)?.name ?? "Barbero";
}

function formatTimeRange(item: ActiveBlockItem): string {
  if (!item.startAt || !item.endAt) return "Todo el día";
  const start = new Date(item.startAt).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  const end = new Date(item.endAt).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  return `${start} - ${end}`;
}

export function ActiveBlocksList({ items, barbers, loading, deleting, onDelete }: ActiveBlocksListProps) {
  if (loading) {
    return (
      <div className="space-y-3" aria-label="Cargando bloqueos activos">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`active-block-skeleton-${index}`}
            className="h-20 rounded-[var(--card-radius)] bg-[rgb(var(--surface-2))] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <CalendarMinus2 className="h-9 w-9 text-[rgb(var(--border))]" aria-hidden="true" />
        <p className="text-sm font-medium text-[rgb(var(--muted))]">No hay bloqueos activos</p>
        <p className="text-xs text-[rgb(var(--muted))] opacity-70">Crea un bloqueo para verlo reflejado aquí.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3" aria-label="Bloqueos activos">
      {items.map((item) => {
        const Icon = TYPE_UI[item.type].icon;
        return (
          <li key={`${item.type}-${item.id}`} className="surface-card rounded-[var(--card-radius)] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="rounded-lg bg-[rgb(var(--surface-2))] p-2 text-[rgb(var(--primary))]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[rgb(var(--fg))]">{TYPE_UI[item.type].label}</p>
                  <p className="text-xs text-[rgb(var(--muted))]">
                    {resolveBarberName(barbers, item.barberId)} • {item.date} • {formatTimeRange(item)}
                  </p>
                  {item.reason ? <p className="mt-1 text-xs text-[rgb(var(--muted))]">{item.reason}</p> : null}
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="md"
                disabled={deleting}
                aria-label="Eliminar bloqueo"
                onClick={async (): Promise<void> => {
                  const confirmed = window.confirm("¿Eliminar este bloqueo? Esta acción no se puede deshacer.");
                  if (!confirmed) return;
                  await onDelete({ id: item.id, type: item.type });
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
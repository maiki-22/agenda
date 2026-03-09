import type { BookingStatus } from "@/types/panel";

interface StatusBadgeProps {
  status: BookingStatus;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  needs_confirmation:
    "bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-200",
  confirmed:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200",
  booked: "bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-200",
  cancelled: "bg-zinc-200 text-zinc-900 dark:bg-zinc-500/20 dark:text-zinc-200",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  needs_confirmation: "Pendiente",
  confirmed: "Confirmada",
  booked: "Reservada",
  cancelled: "Cancelada",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_STYLES[status]}`}
      aria-label={`Estado: ${STATUS_LABELS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

import type { BookingStatus } from "@/types/panel";

interface StatusBadgeProps {
  status: BookingStatus;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  needs_confirmation:
    "bg-amber-500/10 text-amber-700 dark:text-amber-300 [&>span]:bg-amber-500",
  confirmed:
    "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 [&>span]:bg-emerald-500",
  booked: "bg-sky-500/10 text-sky-700 dark:text-sky-300 [&>span]:bg-sky-500",
  cancelled: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 [&>span]:bg-zinc-500",
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
      className={`inline-flex min-h-7 items-center gap-2 rounded-full px-2.5 py-1 text-xs font-normal ${STATUS_STYLES[status]}`}
      aria-label={`Estado: ${STATUS_LABELS[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}

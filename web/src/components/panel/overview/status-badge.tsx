import {
  STATUS_LABELS,
  type BookingStatus,
} from "@/types/panel";


interface StatusBadgeProps {
  status: BookingStatus;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  needs_confirmation:
    "border border-[rgb(var(--primary)/0.3)] bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary))] [&>span]:bg-[rgb(var(--primary))]",
  confirmed:
    "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 [&>span]:bg-emerald-400",
  booked:
    "border border-[rgb(var(--primary)/0.3)] bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary))] [&>span]:bg-[rgb(var(--primary))]",
  cancelled: "border border-red-500/20 bg-red-500/10 text-red-400 [&>span]:bg-red-400",
  rescheduled:
    "border border-sky-500/20 bg-sky-500/10 text-sky-400 [&>span]:bg-sky-400",
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

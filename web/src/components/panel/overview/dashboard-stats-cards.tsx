import { Calendar } from "lucide-react";
import type { BookingItem } from "@/types/panel";


interface DashboardStatsCardsProps {
  bookings: BookingItem[];
}

const SANTIAGO_TIME_ZONE = "America/Santiago";
function getSantiagoDateParts(date: Date): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: SANTIAGO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value ?? "0");
  const month = Number(parts.find((part) => part.type === "month")?.value ?? "0");
  const day = Number(parts.find((part) => part.type === "day")?.value ?? "0");

  return { year, month, day };
}

function getDayOfWeekInSantiago(date: Date): number {
  const weekdayName = new Intl.DateTimeFormat("en-US", {
    timeZone: SANTIAGO_TIME_ZONE,
    weekday: "short",
  }).format(date);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays.indexOf(weekdayName);
}

function toDayNumber(dateParts: { year: number; month: number; day: number }): number {
  return dateParts.year * 10_000 + dateParts.month * 100 + dateParts.day;
}

function getTodayAndWeekRangeInSantiago(): {
  today: number;
  weekStart: number;
  weekEnd: number;
} {
  const now = new Date();
  const todayParts = getSantiagoDateParts(now);
  const dayOfWeek = getDayOfWeekInSantiago(now);
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekStartDate = new Date(now);
  weekStartDate.setUTCDate(weekStartDate.getUTCDate() + mondayOffset);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 6);

  

  return {
    today: toDayNumber(todayParts),
    weekStart: toDayNumber(getSantiagoDateParts(weekStartDate)),
    weekEnd: toDayNumber(getSantiagoDateParts(weekEndDate)),
  };
}

export function DashboardStatsCards({ bookings }: DashboardStatsCardsProps) {
  const { today, weekStart, weekEnd } = getTodayAndWeekRangeInSantiago();

  const reservationsToday = bookings.filter((booking) => {
    const bookingDay = toDayNumber(getSantiagoDateParts(new Date(booking.start_at)));
    return bookingDay === today;
  }).length;

  const reservationsThisWeek = bookings.filter((booking) => {
    const bookingDay = toDayNumber(getSantiagoDateParts(new Date(booking.start_at)));
    return bookingDay >= weekStart && bookingDay <= weekEnd;
  }).length;

  return (
   <section className="grid grid-cols-2 gap-4" aria-label="Indicadores de reservas">
      <article className="surface-card fade-up rounded-[var(--card-radius)] p-4">
        <div className="flex items-center gap-2">
          <Calendar
            className="text-[rgb(var(--primary))]"
            size={18}
            aria-hidden="true"
          />
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
            Reservas hoy
          </p>
        </div>
        <p className="mt-3 text-4xl font-bold leading-none text-[rgb(var(--fg))]">
          {reservationsToday}
        </p>
      </article>

      <article className="surface-card fade-up rounded-[var(--card-radius)] p-4">
        <div className="flex items-center gap-2">
          <Calendar
            className="text-[rgb(var(--primary))]"
            size={18}
            aria-hidden="true"
          />
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[rgb(var(--muted))]">
            Esta semana
          </p>
        </div>
        <p className="mt-3 text-4xl font-bold leading-none text-[rgb(var(--fg))]">
          {reservationsThisWeek}
        </p>
      </article>
    </section>
  );
}

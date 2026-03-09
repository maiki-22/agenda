import type { BookingItem } from "@/types/panel";
import { StatCard } from "./stat-card";

interface DashboardStatsCardsProps {
  bookings: BookingItem[];
}

function getTodayInSantiago(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getCurrentWeekRange(date: Date): { start: string; end: string } {
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const startDate = new Date(date);
  startDate.setDate(date.getDate() + mondayOffset);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return {
    start: formatter.format(startDate),
    end: formatter.format(endDate),
  };
}

export function DashboardStatsCards({ bookings }: DashboardStatsCardsProps) {
  const today = getTodayInSantiago();
  const { start, end } = getCurrentWeekRange(new Date());

  const reservationsToday = bookings.filter(
    (booking) => booking.date === today,
  ).length;
  const reservationsThisWeek = bookings.filter(
    (booking) => booking.date >= start && booking.date <= end,
  ).length;

  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      aria-label="Indicadores de reservas"
    >
      <StatCard
        label="Reservas hoy"
        value={reservationsToday}
        icon={
          <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
            <path
              d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
      <StatCard
        label="Esta semana"
        value={reservationsThisWeek}
        icon={
          <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
            <path
              d="M4 7h16M6 4h12a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2ZM9 11h6M9 15h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </section>
  );
}

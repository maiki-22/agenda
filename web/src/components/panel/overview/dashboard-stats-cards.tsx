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
      className="grid grid-cols-2 gap-3"
      aria-label="Indicadores de reservas"
    >
      <StatCard label="Reservas hoy" value={reservationsToday} />
      <StatCard label="Esta semana" value={reservationsThisWeek} />
    </section>
  );
}

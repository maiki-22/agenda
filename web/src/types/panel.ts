export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export type Barber = { id: string; name: string; active: boolean };

export type WindowOption =
  | "today"
  | "next_7_days"
  | "next_30_days"
  | "custom"
  | "last_7_days"
  | "last_30_days";

export type BookingStatus =
  | "booked"
  | "needs_confirmation"
  | "confirmed"
  | "cancelled"
  | "rescheduled";

export type BookingStatusFilter = "all" | BookingStatus;

export type SummaryByBarber = {
  barber_id: string;
  barber_name: string;
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
};

export type DailySummary = {
  date: string;
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
};

export type OverviewResponse = {
  window: WindowOption;
  date_window: { startDate: string; endDate: string };
  totals: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
  rates: { confirmation_rate: number; cancellation_rate: number };
  by_barber: SummaryByBarber[];
  by_date: DailySummary[];
  barbers: Barber[];
  meta: {
    counts: { raw_appointments: number; filtered_appointments: number };
    generated_at: string;
  };
};

export type BookingItem = {
  id: string;
  date: string;
  time: string;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  customer_name: string;
  customer_phone: string;
  barber_name: string;
  service_name: string;
};

export type BookingsResponse = {
  items: BookingItem[];
  page: number;
  pageSize: number;
  total: number;
};

export type BarberBlockItem = {
  id: string;
  barber_id: string;
  date: string;
  start_at: string;
  end_at: string;
  reason: string | null;
};

export type BarberBlocksResponse = {
  items: BarberBlockItem[];
};

export type BarberDayOffItem = {
  id: string;
  barber_id: string;
  date: string;
  reason: string | null;
};

export type BarberDaysOffResponse = {
  items: BarberDayOffItem[];
};

export type SchedulingPayload = {
  barberId: string;
  date: string;
  reason: string;
};

export type ScheduleBreak = {
  startTime: string;
  endTime: string;
};

export type ScheduleDay = {
  dow: number;
  active: boolean;
  startTime: string;
  endTime: string;
  breaks: ScheduleBreak[];
};

export type BarberScheduleResponse = {
  barberId: string;
  days: ScheduleDay[];
};

export type UpdateBarberScheduleInput = {
  barberId: string;
  days: ScheduleDay[];
};

export const WINDOW_LABELS: Record<WindowOption, string> = {
  today: "Hoy",
  next_7_days: "Próximos 7 días",
  next_30_days: "Próximos 30 días",
  last_7_days: "Últimos 7 días",
  last_30_days: "Últimos 30 días",
  custom: "Personalizado",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  booked: "Reservada",
  needs_confirmation: "Por confirmar",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  rescheduled: "Reagendada",
};

export const STATUS_BADGE: Record<BookingStatus, string> = {
  booked:
    "border border-[rgb(var(--primary)/0.3)] bg-[rgb(var(--primary)/0.12)] text-[rgb(var(--primary))]",
  needs_confirmation:
    "border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--muted))]",
  confirmed:
     "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  cancelled: "border border-red-500/20 bg-red-500/10 text-red-400",
  rescheduled: "border border-sky-500/20 bg-sky-500/10 text-sky-400",
};

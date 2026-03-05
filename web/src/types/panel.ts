export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export type Barber = { id: string; name: string; active: boolean };

export type WindowOption =
  | "next_7_days"
  | "next_30_days"
  | "last_7_days"
  | "last_30_days";

export type BookingStatus =
  | "booked"
  | "needs_confirmation"
  | "confirmed"
  | "cancelled";

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

export type SchedulingPayload = {
  barberId: string;
  date: string;
  reason: string;
};

export const WINDOW_LABELS: Record<WindowOption, string> = {
  next_7_days: "Próximos 7 días",
  next_30_days: "Próximos 30 días",
  last_7_days: "Últimos 7 días",
  last_30_days: "Últimos 30 días",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  booked: "Reservada",
  needs_confirmation: "Por confirmar",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

export const STATUS_BADGE: Record<BookingStatus, string> = {
  booked:
    "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200",
  needs_confirmation:
    "bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-200",
  confirmed:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-200",
};
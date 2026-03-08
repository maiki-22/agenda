export const AGENDA_BLOCKING_APPOINTMENT_STATUSES = [
  "booked",
  "needs_confirmation",
  "confirmed",
] as const;

export const BOOKING_UPDATABLE_STATUSES = [
  "needs_confirmation",
  "booked",
] as const;

export type AppointmentStatus =
  (typeof AGENDA_BLOCKING_APPOINTMENT_STATUSES)[number];

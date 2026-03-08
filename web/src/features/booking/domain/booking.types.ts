import type { ServiceType, BookingDraft } from "./booking.schema";
import type { AppointmentStatus } from "./appointment-status";

export type { ServiceType, BookingDraft };

export type Barber = {
  id: string;
  name: string;
  isActive: boolean;
};

export type Booking = BookingDraft & {
  id: string;
  createdAt: string; // ISO
  durationMinutes: number;
  status: AppointmentStatus;
};

export type AvailabilityQuery = {
  barberId: string;
  date: string;
  service?: ServiceType;
};

export type AvailabilityResult = {
  slots: string[]; // HH:mm start times
};

export type ServiceType = "corte" | "barba" | "corte_y_barba";

export type Barber = {
  id: string;
  name: string;
  isActive: boolean;
};

export type BookingDraft = {
  barberId: string;
  service: ServiceType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerPhone: string; // normalized
};

export type Booking = BookingDraft & {
  id: string;
  createdAt: string; // ISO
  durationMinutes: number;
};

export type AvailabilityQuery = {
  barberId: string;
  date: string; // YYYY-MM-DD
  service?: ServiceType;
};

export type AvailabilityResult = {
  slots: string[]; // HH:mm start times available
};
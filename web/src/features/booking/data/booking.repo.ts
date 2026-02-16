import type { Booking, BookingDraft } from "../domain/booking.types";
import { getServiceDurationMinutes } from "../domain/booking.logic";

const bookings: Booking[] = []; // memoria (MVP). Luego DB.

function makeId(): string {
  return `bk_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function listBookingsByBarberDate(barberId: string, date: string): Booking[] {
  return bookings.filter((b) => b.barberId === barberId && b.date === date);
}

export function createBooking(draft: BookingDraft): Booking {
  const durationMinutes = getServiceDurationMinutes(draft.service);
  const booking: Booking = {
    ...draft,
    id: makeId(),
    durationMinutes,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return booking;
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}
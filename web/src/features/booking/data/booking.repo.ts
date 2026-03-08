import type { Booking, BookingDraft } from "../domain/booking.types";

const bookings: Booking[] = []; // memoria (MVP). Luego DB.

function makeId(): string {
  return `bk_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function listBookingsByBarberDate(barberId: string, date: string): Booking[] {
  return bookings.filter((b) => b.barberId === barberId && b.date === date);
}

export function createBooking(draft: BookingDraft & { durationMinutes: number }): Booking {
  const booking: Booking = {
    ...draft,
    id: makeId(),
    status: "booked",
    durationMinutes: draft.durationMinutes,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return booking;
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}
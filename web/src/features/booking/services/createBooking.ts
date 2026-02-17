import { BookingDraftSchema } from "../domain/booking.schema";
import { createBooking, listBookingsByBarberDate } from "../data/booking.repo";
import { getServiceDurationMinutes } from "../domain/booking.logic";
import type { Booking } from "../domain/booking.types";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export function createBookingService(input: unknown): Booking {
  const draft = BookingDraftSchema.parse(input);

  // Validación de disponibilidad (MVP): no permitir solapes
  const duration = getServiceDurationMinutes(draft.service);
  const start = toMinutes(draft.time);
  const end = start + duration;

  const sameDay = listBookingsByBarberDate(draft.barberId, draft.date);
  const ok = sameDay.every((b) => {
    const bs = toMinutes(b.time);
    const be = bs + b.durationMinutes;
    return !overlaps(start, end, bs, be);
  });

  if (!ok) {
    type SlotTakenError = Error & { code: "SLOT_TAKEN" };
    const err: SlotTakenError = Object.assign(new Error("Horario no disponible"), {
      code: "SLOT_TAKEN" as const,
      });
    throw err;
  }

  return createBooking(draft);
}
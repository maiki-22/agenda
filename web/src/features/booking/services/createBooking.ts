import { BookingDraftSchema } from "../domain/booking.schema";
import { createBooking, listBookingsByBarberDate } from "../data/booking.repo";
import { AGENDA_BLOCKING_APPOINTMENT_STATUSES } from "../domain/appointment-status";
import type { Booking } from "../domain/booking.types";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

type CreateBookingInput = {
  barberId: string;
  service: string; // serviceId
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customerName: string;
  customerPhone: string;
  durationMinutes: number; // viene desde Supabase (source of truth)
};

export function createBookingService(input: unknown): Booking {
  // Validamos el shape base (sin duración)
  const parsed = BookingDraftSchema.parse(input);

  // durationMinutes debe venir desde API (server) luego de validar el servicio
  const durationMinutes = (input as Partial<CreateBookingInput>)
    .durationMinutes;

  if (
    !durationMinutes ||
    typeof durationMinutes !== "number" ||
    durationMinutes <= 0
  ) {
    throw new Error(
      "Missing durationMinutes (server must resolve service duration)",
    );
  }

  const start = toMinutes(parsed.time);
  const end = start + durationMinutes;

  const sameDay = listBookingsByBarberDate(parsed.barberId, parsed.date);
  const blockingStatuses = new Set<string>(
    AGENDA_BLOCKING_APPOINTMENT_STATUSES,
  );

  const ok = sameDay.every((b) => {
    if (!blockingStatuses.has(b.status)) return true;
    const bs = toMinutes(b.time);
    const be = bs + b.durationMinutes;
    return !overlaps(start, end, bs, be);
  });

  if (!ok) {
    const err = Object.assign(new Error("Horario no disponible"), {
      code: "SLOT_TAKEN" as const,
    });
    throw err;
  }

  return createBooking({ ...parsed, durationMinutes });
}

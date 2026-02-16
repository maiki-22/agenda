import type { AvailabilityQuery, AvailabilityResult, ServiceType } from "../domain/booking.types";
import { generateSlots, getServiceDurationMinutes } from "../domain/booking.logic";
import { listBookingsByBarberDate } from "./booking.repo";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function toHHmm(totalMinutes: number): string {
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function buildTakenIntervals(barberId: string, date: string): Array<{ start: number; end: number }> {
  const day = listBookingsByBarberDate(barberId, date);
  return day.map((b) => {
    const start = toMinutes(b.time);
    const end = start + b.durationMinutes;
    return { start, end };
  });
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export function getAvailability(q: AvailabilityQuery): AvailabilityResult {
  const baseSlots = generateSlots("09:00", "18:00", 30);
  const taken = buildTakenIntervals(q.barberId, q.date);

  // Si no viene service, devuelve slots “base” filtrando solo ocupados por 30 min
  const duration = q.service ? getServiceDurationMinutes(q.service as ServiceType) : 30;

  const available: string[] = [];
  for (const slot of baseSlots) {
    const start = toMinutes(slot);
    const end = start + duration;

    // check no overlap with any taken interval
    const ok = taken.every((t) => !overlaps(start, end, t.start, t.end));
    if (ok) available.push(toHHmm(start));
  }

  return { slots: available };
}
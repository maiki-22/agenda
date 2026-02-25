import { z } from "zod";
import { getAvailability } from "../data/availability.repo";
import type { AvailabilityResult } from "../domain/booking.types";

const QuerySchema = z.object({
  barberId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationMinutes: z.number().int().positive().optional(),
});

export async function getAvailabilityService(input: unknown): Promise<AvailabilityResult> {
  const q = QuerySchema.parse(input);
  return getAvailability({
    barberId: q.barberId,
    date: q.date,
    durationMinutes: q.durationMinutes,
  });
}
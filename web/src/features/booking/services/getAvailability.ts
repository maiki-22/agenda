import { z } from "zod";
import { getAvailability } from "../data/availability.repo";
import type { AvailabilityResult } from "../domain/booking.types";
import { ServiceTypeSchema } from "../domain/booking.schema";

const QuerySchema = z.object({
  barberId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  service: ServiceTypeSchema.optional(),
});

export function getAvailabilityService(input: unknown): AvailabilityResult {
  const q = QuerySchema.parse(input);
  return getAvailability(q);
}
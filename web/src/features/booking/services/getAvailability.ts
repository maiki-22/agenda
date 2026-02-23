import { z } from "zod";
import { getAvailability } from "../data/availability.repo";
import type { AvailabilityResult } from "../domain/booking.types";
import { SERVICES } from "../domain/booking.logic";
import type { ServiceType } from "../domain/booking.schema";

const serviceIds = SERVICES.map((s) => s.id) as [ServiceType, ...ServiceType[]];

const QuerySchema = z.object({
  barberId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  service: z.enum(serviceIds).optional(),
});

export function getAvailabilityService(input: unknown): AvailabilityResult {
  const q = QuerySchema.parse(input);
  return getAvailability(q);
}
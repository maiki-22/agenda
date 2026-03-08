import { z } from "zod";
import { BarberIdSchema } from "@/validations/barber-id.schema";
import { ServiceIdSchema } from "@/validations/service-id.schema";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const availabilityQuerySchema = z.object({
  barberId: BarberIdSchema,
  date: z
    .string()
    .trim()
    .regex(isoDateRegex, "La fecha debe tener formato YYYY-MM-DD"),
  service: ServiceIdSchema.optional(),
});

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
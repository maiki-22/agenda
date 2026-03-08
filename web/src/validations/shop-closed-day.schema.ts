import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const shopClosedDaySchema = z.object({
  date: z
    .string()
    .trim()
    .regex(isoDateRegex, "La fecha debe tener formato YYYY-MM-DD"),
  reason: z.string().trim().max(140).optional(),
});

export type ShopClosedDayInput = z.infer<typeof shopClosedDaySchema>;

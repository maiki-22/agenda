import { z } from "zod";

const STATUS_VALUES = [
  "all",
  "booked",
  "needs_confirmation",
  "confirmed",
  "cancelled",
] as const;

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const panelBookingsQuerySchema = z.object({
  dateFrom: z
    .string()
    .trim()
    .regex(isoDateRegex, "dateFrom debe tener formato YYYY-MM-DD")
    .optional(),
  dateTo: z
    .string()
    .trim()
    .regex(isoDateRegex, "dateTo debe tener formato YYYY-MM-DD")
    .optional(),
  barberId: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(STATUS_VALUES).default("all"),
  q: z.string().trim().max(120).default(""),
});

export type PanelBookingsQuery = z.infer<typeof panelBookingsQuerySchema>;
import { z } from "zod";
import { normalizePhone } from "./booking.logic";

export const ServiceTypeSchema = z.enum(["corte", "barba", "corte_y_barba"]);

export const BookingDraftSchema = z.object({
  barberId: z.string().min(1, "Selecciona un barbero"),
  service: ServiceTypeSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  customerName: z.string().min(2, "Ingresa tu nombre"),
  customerPhone: z
    .string()
    .transform((v) => normalizePhone(v))
    .refine((v) => v.length >= 8, "Ingresa un número de teléfono válido"),
});
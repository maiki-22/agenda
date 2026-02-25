import { z } from "zod";

export type ServiceType = string;

export const BookingDraftSchema = z.object({
  barberId: z.string().min(1, "Selecciona un barbero"),
  service: z.string().min(1, "Selecciona un servicio"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  customerName: z.string().min(2, "Ingresa tu nombre"),
  customerPhone: z
    .string()
    .regex(/^\+569\d{8}$/, "Ingresa un móvil válido: +569XXXXXXXX"),
});

export type BookingDraft = z.infer<typeof BookingDraftSchema>;
import { z } from "zod";
import { CustomerNameSchema } from "@/validations/customer-name.schema";
import { CustomerPhoneSchema } from "@/validations/customer-phone.schema";

export type ServiceType = string;

export const BookingDraftSchema = z.object({
  barberId: z.string().min(1, "Selecciona un barbero"),
  service: z.string().min(1, "Selecciona un servicio"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  customerName: CustomerNameSchema,
  customerPhone: CustomerPhoneSchema,
});

export type BookingDraft = z.infer<typeof BookingDraftSchema>;
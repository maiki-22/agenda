import { z } from "zod";
import { BarberIdSchema } from "@/validations/barber-id.schema";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const scheduleBreakSchema = z
  .object({
    startTime: z.string().regex(timePattern, "Hora de inicio inválida"),
    endTime: z.string().regex(timePattern, "Hora de fin inválida"),
  })
  .refine((value) => value.startTime < value.endTime, {
    message: "La pausa debe tener una hora de término mayor a la inicial",
    path: ["endTime"],
  });

export const scheduleDaySchema = z
  .object({
    dow: z.number().int().min(0).max(6),
    active: z.boolean(),
    startTime: z.string().regex(timePattern, "Hora de inicio inválida"),
    endTime: z.string().regex(timePattern, "Hora de fin inválida"),
    breaks: z.array(scheduleBreakSchema).max(1, "Solo se permite una pausa por día"),
  })
  .refine((value) => value.startTime < value.endTime, {
    message: "La hora de término debe ser mayor a la inicial",
    path: ["endTime"],
  })
  .refine(
    (value) =>
      value.breaks.every(
        (breakItem) =>
          breakItem.startTime >= value.startTime && breakItem.endTime <= value.endTime,
      ),
    {
      message: "La pausa debe estar dentro del horario del día",
      path: ["breaks"],
    },
  );

export const panelScheduleQuerySchema = z.object({
  barberId: BarberIdSchema,
});

export const panelScheduleBodySchema = z.object({
  barberId: BarberIdSchema,
  days: z.array(scheduleDaySchema).length(7, "Debes enviar los 7 días"),
});
import { z } from "zod";

export const bookingConfirmationEndpointSchema = z
  .object({
    bookingId: z.string().trim().min(1).optional(),
    token: z.string().trim().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.bookingId && !value.token) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes enviar bookingId o token",
        path: ["bookingId"],
      });
    }
  });

export type BookingConfirmationEndpointInput = z.infer<
  typeof bookingConfirmationEndpointSchema
>;
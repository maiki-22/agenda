import { z } from "zod";
import { ConfirmationTokenSchema } from "@/validations/confirmation-token.schema";

export const BookingConfirmationRequestSchema = z
  .object({
    queryToken: z.string().trim().min(1).optional(),
    authorizationHeader: z.string().trim().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.queryToken && !value.authorizationHeader) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["queryToken"],
        message: "Debes enviar token por query param o Authorization header",
      });
    }
  });

export const BookingConfirmationClaimsSchema = z.object({
  booking_id: z.string().trim().min(1),
  booking_token: ConfirmationTokenSchema,
  iat: z.number().int().nonnegative(),
  exp: z.number().int().positive(),
  iss: z.literal("agenda-booking"),
  aud: z.literal("booking-confirmation"),
});

export const BookingConfirmationSearchParamsSchema = z.object({
  token: z.string().trim().min(1),
});

export const BookingConfirmationActionSchema = z.object({
  action: z.enum(["confirmed", "cancelled"]),
  token: z.string().trim().min(1),
});

export type BookingConfirmationClaims = z.infer<typeof BookingConfirmationClaimsSchema>;
export type BookingConfirmationAction = z.infer<typeof BookingConfirmationActionSchema>;
import { z } from "zod";

export const CANCEL_REASON_MAX_LENGTH = 280;

export const CancelReasonSchema = z
  .string()
  .trim()
  .max(CANCEL_REASON_MAX_LENGTH, "El motivo de cancelación no puede exceder 280 caracteres")
  .transform((value) => value.replace(/\s+/g, " "));
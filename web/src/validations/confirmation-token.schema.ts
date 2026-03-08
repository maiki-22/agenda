import { z } from "zod";

export const CONFIRMATION_TOKEN_MIN_LENGTH = 20;
export const CONFIRMATION_TOKEN_MAX_LENGTH = 128;
const CONFIRMATION_TOKEN_REGEX = /^[A-Za-z0-9_-]+$/;

export const ConfirmationTokenSchema = z
  .string()
  .trim()
  .min(CONFIRMATION_TOKEN_MIN_LENGTH, "Token de confirmación inválido")
  .max(CONFIRMATION_TOKEN_MAX_LENGTH, "Token de confirmación inválido")
  .regex(CONFIRMATION_TOKEN_REGEX, "Token de confirmación inválido");
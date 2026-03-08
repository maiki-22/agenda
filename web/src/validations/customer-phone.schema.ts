import { z } from "zod";

export const CUSTOMER_PHONE_MIN_LENGTH = 8;
export const CUSTOMER_PHONE_MAX_LENGTH = 16;
const E164_PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

export const CustomerPhoneSchema = z
  .string()
  .trim()
  .min(CUSTOMER_PHONE_MIN_LENGTH, "Ingresa un teléfono válido en formato: +56 9XXXXXXXX")
  .max(CUSTOMER_PHONE_MAX_LENGTH, "El teléfono excede el largo permitido")
  .regex(E164_PHONE_REGEX, "Ingresa un teléfono válido en formato: +56 9XXXXXXXX");

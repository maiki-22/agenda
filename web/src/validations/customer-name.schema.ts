import { z } from "zod";

export const CUSTOMER_NAME_MIN_LENGTH = 2;
export const CUSTOMER_NAME_MAX_LENGTH = 80;
const CUSTOMER_NAME_REGEX = /^[\p{L}\s.'-]+$/u;

export const CustomerNameSchema = z
  .string()
  .trim()
  .min(CUSTOMER_NAME_MIN_LENGTH, "Ingresa tu nombre")
  .max(CUSTOMER_NAME_MAX_LENGTH, "El nombre es demasiado largo")
  .regex(
    CUSTOMER_NAME_REGEX,
    "El nombre solo puede contener letras, espacios, apóstrofes, puntos y guiones",
  )
  .transform((value) => value.replace(/\s+/g, " "));
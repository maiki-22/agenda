import { z } from "zod";

export const authLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .email("Ingresa un email válido")
    .max(120, "El email es demasiado largo"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña es demasiado larga"),
});

export type AuthLoginInput = z.infer<typeof authLoginSchema>;
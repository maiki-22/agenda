import { z } from "zod";
import type { ServiceResult } from "@/types/panel";

const errorSchema = z.object({
  error: z.string().optional(),
  code: z.string().optional(),
});

export async function requestJson<T>(
  input: RequestInfo,
  init: RequestInit,
  schema: z.ZodType<T>,
): Promise<ServiceResult<T>> {
  try {
    const response = await fetch(input, init);
    const raw = (await response.json()) as unknown;

    if (!response.ok) {
      const parsedError = errorSchema.safeParse(raw);
      return {
        success: false,
        error: parsedError.success
          ? (parsedError.data.error ?? "No se pudo completar la operación")
          : "No se pudo completar la operación",
        code: parsedError.success ? parsedError.data.code : undefined,
      };
    }

    const parsedData = schema.safeParse(raw);
    if (!parsedData.success) {
      return { success: false, error: "Respuesta inválida del servidor" };
    }

    return { success: true, data: parsedData.data };
  } catch {
    return {
      success: false,
      error: "Error de red al comunicarse con el servidor",
    };
  }
}

import { z } from "zod";

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; status?: number };

const availabilityResponseSchema = z.object({
  slots: z.array(z.string()),
});

const availabilityBatchResponseSchema = z.object({
  slotsByDate: z.record(z.string(), z.array(z.string())),
});

const errorResponseSchema = z.object({
  error: z.string().optional(),
  code: z.string().optional(),
});

type AvailabilityParams = {
  barberId: string;
  date: string;
  service?: string;
};

type AvailabilityBatchParams = {
  barberId: string;
  from: string;
  to: string;
  service?: string;
};

async function parseServiceError(response: Response): Promise<{
  error: string;
  code?: string;
}> {
  const raw = (await response.json().catch(() => ({}))) as unknown;
  const parsed = errorResponseSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: "No se pudo validar disponibilidad" };
  }

  return {
    error: parsed.data.error ?? "No se pudo validar disponibilidad",
    code: parsed.data.code,
  };
}

export async function fetchAvailability(
  params: AvailabilityParams,
): Promise<ServiceResult<z.infer<typeof availabilityResponseSchema>>> {
  const searchParams = new URLSearchParams({
    barberId: params.barberId,
    date: params.date,
  });

  if (params.service) {
    searchParams.set("service", params.service);
  }

  try {
    const response = await fetch(`/api/availability?${searchParams.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const parsedError = await parseServiceError(response);
      return {
        success: false,
        error: parsedError.error,
        code: parsedError.code,
        status: response.status,
      };
    }

    const raw = (await response.json()) as unknown;
    const parsed = availabilityResponseSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: "Respuesta inválida de disponibilidad",
      };
    }

    return { success: true, data: parsed.data };
  } catch {
    return {
      success: false,
      error: "Error de red al validar disponibilidad",
    };
  }
}

export async function fetchAvailabilityBatch(
  params: AvailabilityBatchParams,
): Promise<ServiceResult<z.infer<typeof availabilityBatchResponseSchema>>> {
  const searchParams = new URLSearchParams({
    barberId: params.barberId,
    from: params.from,
    to: params.to,
  });

  if (params.service) {
    searchParams.set("service", params.service);
  }

  try {
    const response = await fetch(`/api/availability/batch?${searchParams.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const parsedError = await parseServiceError(response);
      return {
        success: false,
        error: parsedError.error,
        code: parsedError.code,
        status: response.status,
      };
    }

    const raw = (await response.json()) as unknown;
    const parsed = availabilityBatchResponseSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: "Respuesta inválida de disponibilidad por rango",
      };
    }

    return { success: true, data: parsed.data };
  } catch {
    return {
      success: false,
      error: "Error de red al validar disponibilidad por rango",
    };
  }
}
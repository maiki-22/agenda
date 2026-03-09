"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const BookingSchema = z.object({
  id: z.string(),
  date: z.string(),
  time: z.string(),
  durationMinutes: z.number(),
  status: z.string(),
  createdAt: z.string(),
  customerName: z.string(),
  customerPhoneMasked: z.string(),
  barberName: z.string().optional(),
  serviceName: z.string().optional(),
  servicePriceClp: z.number().nullable().optional(),
});

const ConfirmacionSchema = z.object({
  booking: BookingSchema,
});

export type ConfirmacionData = z.infer<typeof ConfirmacionSchema>;

type ConfirmacionErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE"
  | "UNKNOWN_ERROR";

export type ConfirmacionError = {
  code: ConfirmacionErrorCode;
  status: number | null;
  message: string;
};

class ConfirmacionApiError extends Error {
  public readonly status: number | null;
  public readonly code: ConfirmacionErrorCode;

  constructor({
    message,
    code,
    status,
  }: {
    message: string;
    code: ConfirmacionErrorCode;
    status: number | null;
  }) {
    super(message);
    this.name = "ConfirmacionApiError";
    this.code = code;
    this.status = status;
  }
}

function mapErrorByStatus(status: number): ConfirmacionError {
  if (status === 401) {
    return {
      code: "UNAUTHORIZED",
      status,
      message: "No tienes autorización para ver esta confirmación.",
    };
  }

  if (status === 404) {
    return {
      code: "NOT_FOUND",
      status,
      message: "No encontramos la reserva. Revisa el enlace o vuelve a reservar.",
    };
  }

  if (status >= 500) {
    return {
      code: "SERVER_ERROR",
      status,
      message: "Tuvimos un problema en el servidor. Intenta nuevamente.",
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    status,
    message: "No pudimos confirmar tu reserva en este momento.",
  };
}

function buildErrorFromUnknown(error: unknown): ConfirmacionError {
  if (error instanceof ConfirmacionApiError) {
    return {
      code: error.code,
      status: error.status,
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      status: null,
      message: error.message,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    status: null,
    message: "No pudimos confirmar tu reserva en este momento.",
  };
}


async function fetchConfirmacion(token: string): Promise<ConfirmacionData> {
  let response: Response;

  try {
    response = await fetch(`/api/booking?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
    });
  } catch {
    throw new ConfirmacionApiError({
      code: "NETWORK_ERROR",
      status: null,
      message: "No hay conexión. Verifica tu internet e intenta otra vez.",
    });
  }
  const raw = (await response.json().catch(() => ({}))) as unknown;

  if (!response.ok) {
    const mappedError = mapErrorByStatus(response.status);
    throw new ConfirmacionApiError(mappedError);
  }

  const parsed = ConfirmacionSchema.safeParse(raw);

  if (!parsed.success) {
    throw new ConfirmacionApiError({
      code: "INVALID_RESPONSE",
      status: response.status,
      message: "Recibimos una respuesta inválida al confirmar la reserva.",
    });
  }

  return parsed.data;
}

export function useConfirmacion(
  token: string,
  initialData?: ConfirmacionData,
): {
  booking: z.infer<typeof BookingSchema> | null;
  isLoading: boolean;
  isError: boolean;
  error: ConfirmacionError | null;
  refetch: () => Promise<unknown>;
} {
  const query = useQuery<ConfirmacionData, unknown>({
    queryKey: ["booking-confirmacion", token],
    queryFn: (): Promise<ConfirmacionData> => fetchConfirmacion(token),
    enabled: token.length > 0,
    initialData,
    staleTime: 30_000,
  });

  return {
    booking: query.data?.booking ?? null,
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError,
    error: query.error ? buildErrorFromUnknown(query.error) : null,
    refetch: (): Promise<unknown> => query.refetch(),
  };
}
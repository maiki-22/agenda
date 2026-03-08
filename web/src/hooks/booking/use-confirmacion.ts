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

async function fetchConfirmacion(token: string): Promise<ConfirmacionData> {
  const response = await fetch(`/api/booking?token=${encodeURIComponent(token)}`, {
    cache: "no-store",
  });

  const raw = (await response.json().catch(() => ({}))) as unknown;

  if (!response.ok) {
    throw new Error("No se pudo cargar la reserva");
  }

  const parsed = ConfirmacionSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("Respuesta inválida de confirmación");
  }

  return parsed.data;
}

export function useConfirmacion(
  token: string,
  initialData?: ConfirmacionData,
): {
  booking: z.infer<typeof BookingSchema> | null;
  isLoading: boolean;
  error: string;
} {
  const query = useQuery<ConfirmacionData, Error>({
    queryKey: ["booking-confirmacion", token],
    queryFn: (): Promise<ConfirmacionData> => fetchConfirmacion(token),
    enabled: token.length > 0,
    initialData,
    staleTime: 30_000,
  });

  return {
    booking: query.data?.booking ?? null,
    isLoading: query.isLoading || query.isFetching,
    error: query.error?.message ?? "",
  };
}
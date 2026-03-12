import { z } from "zod";
import { requestJson } from "./http";
import type {
  BookingsResponse,
  BookingStatus,
  BookingStatusFilter,
  ServiceResult,
} from "@/types/panel";

const bookingsSchema: z.ZodType<BookingsResponse> = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      time: z.string(),
      start_at: z.string(),
      end_at: z.string(),
      status: z.enum([
        "booked",
        "needs_confirmation",
        "confirmed",
        "cancelled",
        "rescheduled",
      ]),
      customer_name: z.string(),
      customer_phone: z.string(),
      barber_name: z.string(),
      service_name: z.string(),
    }),
  ),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

type GetBookingsParams = {
  dateFrom: string;
  dateTo: string;
  barberId?: string;
  status: BookingStatusFilter;
  query: string;
};

export async function getBookings(params: GetBookingsParams): Promise<ServiceResult<BookingsResponse>> {
  const searchParams = new URLSearchParams({
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    page: "1",
    pageSize: "8",
  });

  if (params.barberId) {
    searchParams.set("barberId", params.barberId);
  }
  if (params.status !== "all") {
    searchParams.set("status", params.status);
  }
  if (params.query.trim()) {
    searchParams.set("q", params.query.trim());
  }

  return requestJson(`/api/panel/bookings?${searchParams.toString()}`, { cache: "no-store" }, bookingsSchema);
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<ServiceResult<{ ok: boolean }>> {
  return requestJson(
    `/api/panel/bookings/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
    z.record(z.string(), z.unknown()).transform(() => ({ ok: true as const })),
  );
}
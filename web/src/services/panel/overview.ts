import { z } from "zod";
import { requestJson } from "./http";
import type { OverviewResponse, ServiceResult, WindowOption } from "@/types/panel";

const overviewSchema: z.ZodType<OverviewResponse> = z.object({
  window: z.enum(["today", "next_7_days", "next_30_days", "custom"]),
  date_window: z.object({ startDate: z.string(), endDate: z.string() }),
  totals: z.object({
    total: z.number(),
    confirmed: z.number(),
    pending: z.number(),
    cancelled: z.number(),
  }),
  rates: z.object({ confirmation_rate: z.number(), cancellation_rate: z.number() }),
  by_barber: z.array(
    z.object({
      barber_id: z.string(),
      barber_name: z.string(),
      total: z.number(),
      confirmed: z.number(),
      pending: z.number(),
      cancelled: z.number(),
    }),
  ),
  by_date: z.array(
    z.object({
      date: z.string(),
      total: z.number(),
      confirmed: z.number(),
      pending: z.number(),
      cancelled: z.number(),
    }),
  ),
  barbers: z.array(z.object({ id: z.string(), name: z.string(), active: z.boolean() })),
  meta: z.object({
    counts: z.object({ raw_appointments: z.number(), filtered_appointments: z.number() }),
    generated_at: z.string(),
  }),
});

export async function getOverview(params: {
  window: WindowOption;
  barberId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ServiceResult<OverviewResponse>> {
  const searchParams = new URLSearchParams({ window: params.window });

  if (params.barberId && params.barberId !== "all") {
    searchParams.set("barberId", params.barberId);
  }
  if (params.window === "custom" && params.startDate && params.endDate) {
    searchParams.set("startDate", params.startDate);
    searchParams.set("endDate", params.endDate);
  }

  return requestJson(
    `/api/panel/overview?${searchParams.toString()}`,
    { cache: "no-store", credentials: "include" },
    overviewSchema,
  );
}

export async function toggleBarberStatus(
  barberId: string,
  active: boolean,
): Promise<ServiceResult<{ ok: boolean }>> {
  return requestJson(
    `/api/panel/barbers/${barberId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    },
     z
      .object({ ok: z.literal(true) })
      .or(z.object({ success: z.literal(true) }).transform(() => ({ ok: true }))),
  );
}
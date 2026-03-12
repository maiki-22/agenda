import { z } from "zod";
import { requestJson } from "./http";
import type {
  BarberScheduleResponse,
  BarberBlocksResponse,
  BarberDaysOffResponse,
  ServiceResult,
  UpdateBarberScheduleInput,
} from "@/types/panel";

const okSchema = z.record(z.string(), z.unknown()).transform(() => ({ ok: true as const }));

const barberBlocksSchema: z.ZodType<BarberBlocksResponse> = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      barber_id: z.string(),
      date: z.string(),
      start_at: z.string(),
      end_at: z.string(),
      reason: z.string().nullable(),
    }),
  ),
});

const barberDaysOffSchema: z.ZodType<BarberDaysOffResponse> = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      barber_id: z.string(),
      date: z.string(),
      reason: z.string().nullable(),
    }),
  ),
});

const barberScheduleSchema: z.ZodType<BarberScheduleResponse> = z.object({
  barberId: z.string(),
  days: z.array(
    z.object({
      dow: z.number().int().min(0).max(6),
      active: z.boolean(),
      startTime: z.string(),
      endTime: z.string(),
      breaks: z.array(
        z.object({
          startTime: z.string(),
          endTime: z.string(),
        }),
      ),
    }),
  ),
});

const okOnlySchema = z.object({ ok: z.boolean() });

export async function getBarberSchedule(params: {
  barberId: string;
}): Promise<ServiceResult<BarberScheduleResponse>> {
  const searchParams = new URLSearchParams({ barberId: params.barberId });
  const response = await requestJson(
    `/api/panel/schedule?${searchParams.toString()}`,
    { cache: "no-store" },
    z.object({ success: z.literal(true), data: barberScheduleSchema }),
  );

  if (!response.success) {
    return response;
  }

  return { success: true, data: response.data.data };
}

export async function updateBarberSchedule(
  input: UpdateBarberScheduleInput,
): Promise<ServiceResult<{ ok: boolean }>> {
  const response = await requestJson(
    "/api/panel/schedule",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    z.object({ success: z.literal(true), data: okOnlySchema }),
  );

  if (!response.success) {
    return response;
  }

  return { success: true, data: response.data.data };
}


export async function getBarberBlocks(params: {
  barberId: string;
}): Promise<ServiceResult<BarberBlocksResponse>> {
  const searchParams = new URLSearchParams({ barberId: params.barberId });
  return requestJson(
    `/api/panel/barber-blocks?${searchParams.toString()}`,
    { cache: "no-store" },
    barberBlocksSchema,
  );
}

export async function getBarberDaysOff(params: {
  barberId: string;
}): Promise<ServiceResult<BarberDaysOffResponse>> {
  const searchParams = new URLSearchParams({ barberId: params.barberId });
  return requestJson(
    `/api/panel/barber-days-off?${searchParams.toString()}`,
    { cache: "no-store" },
    barberDaysOffSchema,
  );
}


export async function createBarberBlock(input: {
  barberId: string;
  date: string;
  start: string;
  end: string;
  reason: string;
}): Promise<ServiceResult<{ ok: boolean }>> {
  return requestJson(
    "/api/panel/barber-blocks",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barber_id: input.barberId,
        date: input.date,
        start_at: `${input.date}T${input.start}:00-03:00`,
        end_at: `${input.date}T${input.end}:00-03:00`,
        reason: input.reason,
      }),
    },
    okSchema,
  );
}

export async function createBarberDayOff(input: {
  barberId: string;
  date: string;
  reason: string;
}): Promise<ServiceResult<{ ok: boolean }>> {
  return requestJson(
    "/api/panel/barber-days-off",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barber_id: input.barberId,
        date: input.date,
        reason: input.reason,
      }),
    },
    okSchema,
  );
}

export async function createShopClosedDay(input: {
  date: string;
  reason: string;
}): Promise<ServiceResult<{ ok: boolean }>> {
  return requestJson(
    "/api/panel/shop-closed-days",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: input.date, reason: input.reason }),
    },
    okSchema,
  );
}
import { z } from "zod";
import { requestJson } from "./http";
import type { ServiceResult } from "@/types/panel";

const okSchema = z.record(z.string(), z.unknown()).transform(() => ({ ok: true as const }));

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
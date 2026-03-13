import { z } from "zod";
import { requestJson } from "@/services/panel/http";
import type { ServiceResult } from "@/types/panel";

export type PanelBlockType = "shop-closed" | "barber-day-off" | "barber-block";

export type ActiveBlockItem = {
  id: string;
  type: PanelBlockType;
  date: string;
  reason: string | null;
  barberId: string | null;
  startAt: string | null;
  endAt: string | null;
};

const shopClosedDaysSchema = z.object({
  ok: z.boolean(),
  items: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      reason: z.string().nullable(),
    }),
  ),
});

const barberDaysOffSchema = z.object({
  ok: z.boolean(),
  items: z.array(
    z.object({
      id: z.string(),
      barber_id: z.string(),
      date: z.string(),
      reason: z.string().nullable(),
    }),
  ),
});

const barberBlocksSchema = z.object({
  ok: z.boolean(),
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

const okSchema = z.object({ ok: z.boolean() });

export async function getActiveBlocks(params: {
  barberId?: string;
}): Promise<ServiceResult<Array<ActiveBlockItem>>> {
  const searchParams = params.barberId
    ? new URLSearchParams({ barberId: params.barberId })
    : null;

  const [shopClosedDays, barberDaysOff, barberBlocks] = await Promise.all([
    requestJson(
      "/api/panel/shop-closed-days",
      { cache: "no-store" },
      shopClosedDaysSchema,
    ),
    requestJson(
      searchParams
        ? `/api/panel/barber-days-off?${searchParams.toString()}`
        : "/api/panel/barber-days-off",
      { cache: "no-store" },
      barberDaysOffSchema,
    ),
    requestJson(
      searchParams
        ? `/api/panel/barber-blocks?${searchParams.toString()}`
        : "/api/panel/barber-blocks",
      { cache: "no-store" },
      barberBlocksSchema,
    ),
  ]);

  if (!shopClosedDays.success) return shopClosedDays;
  if (!barberDaysOff.success) return barberDaysOff;
  if (!barberBlocks.success) return barberBlocks;

  const mergedItems: Array<ActiveBlockItem> = [
    ...shopClosedDays.data.items.map((item) => ({
      id: item.id,
      type: "shop-closed" as const,
      date: item.date,
      reason: item.reason,
      barberId: null,
      startAt: null,
      endAt: null,
    })),
    ...barberDaysOff.data.items.map((item) => ({
      id: item.id,
      type: "barber-day-off" as const,
      date: item.date,
      reason: item.reason,
      barberId: item.barber_id,
      startAt: null,
      endAt: null,
    })),
    ...barberBlocks.data.items.map((item) => ({
      id: item.id,
      type: "barber-block" as const,
      date: item.date,
      reason: item.reason,
      barberId: item.barber_id,
      startAt: item.start_at,
      endAt: item.end_at,
    })),
  ].sort((firstItem, secondItem) => {
    const firstDate = firstItem.startAt ?? `${firstItem.date}T00:00:00-03:00`;
    const secondDate =
      secondItem.startAt ?? `${secondItem.date}T00:00:00-03:00`;
    return firstDate.localeCompare(secondDate);
  });

  return { success: true, data: mergedItems };
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
      body: JSON.stringify({
        date: input.date,
        reason: input.reason || undefined,
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
        reason: input.reason || undefined,
      }),
    },
    okSchema,
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
        reason: input.reason || undefined,
      }),
    },
    okSchema,
  );
}

export async function deleteActiveBlock(input: {
  type: PanelBlockType;
  id: string;
}): Promise<ServiceResult<{ ok: boolean }>> {
  const endpointByType: Record<PanelBlockType, string> = {
    "shop-closed": "/api/panel/shop-closed-days",
    "barber-day-off": "/api/panel/barber-days-off",
    "barber-block": "/api/panel/barber-blocks",
  };
  const searchParams = new URLSearchParams({ id: input.id });

  return requestJson(
    `${endpointByType[input.type]}?${searchParams.toString()}`,
    { method: "DELETE" },
    okSchema,
  );
}

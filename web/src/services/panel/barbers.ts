import { z } from "zod";
import { requestJson } from "./http";
import type { Barber, ServiceResult } from "@/types/panel";

const barbersSchema: z.ZodType<Array<Barber>> = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    active: z.boolean(),
  }),
);

const panelBarbersSchema = z.object({
  barbers: barbersSchema,
});

export async function getPanelBarbers(): Promise<ServiceResult<Array<Barber>>> {
  const result = await requestJson(
    "/api/panel/barbers",
    { cache: "no-store", credentials: "include" },
    panelBarbersSchema,
  );

  if (!result.success) {
    return result;
  }

  return { success: true, data: result.data.barbers };
}
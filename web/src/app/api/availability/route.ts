import { NextResponse } from "next/server";
import { getAvailabilityService } from "@/features/booking/services/getAvailability";
import type { ServiceType } from "@/features/booking/domain/booking.types";

function parseService(value: string | null): ServiceType | undefined {
  if (value === "corte" || value === "barba" || value === "corte_y_barba") return value;
  return undefined;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get("barberId") ?? "";
    const date = searchParams.get("date") ?? "";
    const service = parseService(searchParams.get("service"));

    const result = getAvailabilityService({ barberId, date, service });
    return NextResponse.json(result, { status: 200 });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error("Bad Request");
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
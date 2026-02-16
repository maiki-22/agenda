import { NextResponse } from "next/server";
import { getAvailabilityService } from "@/features/booking/services/getAvailability";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get("barberId") ?? "";
    const date = searchParams.get("date") ?? "";
    const service = (searchParams.get("service") ?? undefined) as any;

    const result = getAvailabilityService({ barberId, date, service });
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Bad Request" },
      { status: 400 }
    );
  }
}
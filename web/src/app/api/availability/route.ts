import { NextResponse } from "next/server";
import { getAvailabilityService } from "@/features/booking/services/getAvailability";
import { listServices } from "@/features/booking/data/catalog.repo";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get("barberId") ?? "";
    const date = searchParams.get("date") ?? "";
    const serviceId = searchParams.get("service") ?? "";

    if (!barberId) return NextResponse.json({ error: "Missing barberId" }, { status: 400 });
    if (!date) return NextResponse.json({ error: "Missing date" }, { status: 400 });

    let durationMinutes: number | undefined;

    if (serviceId) {
      const services = await listServices();
      const svc = services.find((s) => s.id === serviceId);
      if (!svc) {
        return NextResponse.json(
          { error: "Servicio inválido", code: "INVALID_SERVICE" },
          { status: 400 }
        );
      }
      durationMinutes = svc.duration_min;
    }

    const result = await getAvailabilityService({ barberId, date, durationMinutes });
    return NextResponse.json(result, { status: 200 });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error("Bad Request");
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
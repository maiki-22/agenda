import { NextResponse } from "next/server";
import { getAvailabilityService } from "@/features/booking/services/getAvailability";
import { listServices } from "@/features/booking/data/catalog.repo";
import { availabilityRatelimit } from "@/lib/ratelimit";

function getClientIp(req: Request) {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(req: Request) {
  // ✅ Rate limit por IP
  const ip = getClientIp(req);
  const rl = await availabilityRatelimit.limit(`ip:${ip}`);

  if (!rl.success) {
    const res = NextResponse.json(
      { error: "Too many requests", code: "RATE_LIMITED" },
      { status: 429 },
    );
    res.headers.set("RateLimit-Limit", String(rl.limit));
    res.headers.set("RateLimit-Remaining", String(rl.remaining));
    res.headers.set("RateLimit-Reset", String(rl.reset));
    return res;
  }

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
          { status: 400 },
        );
      }
      durationMinutes = svc.duration_min;
    }

    const result = await getAvailabilityService({ barberId, date, durationMinutes });

    const res = NextResponse.json(result, { status: 200 });
    res.headers.set("RateLimit-Limit", String(rl.limit));
    res.headers.set("RateLimit-Remaining", String(rl.remaining));
    res.headers.set("RateLimit-Reset", String(rl.reset));
    return res;
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error("Bad Request");
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
import { NextResponse } from "next/server";
import { getAvailabilityService } from "@/features/booking/services/getAvailability";
import { listServices } from "@/features/booking/data/catalog.repo";
import { applyRateLimitHeaders, availabilityRatelimit, limitWithFailover } from "@/lib/ratelimit";
import { getTypedSearchParams } from "@/lib/search-params";
import { availabilityQuerySchema } from "@/validations/availability-query.schema";

function getClientIp(req: Request) {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(req: Request) {
  // ✅ Rate limit por IP
  const ip = getClientIp(req);
  const rl = await limitWithFailover({
    ratelimit: availabilityRatelimit,
    key: `ip:${ip}`,
    fallbackLimit: 90,
    circuitKey: "availability",
  });
  if (!rl.success) {
    const res = NextResponse.json(
      { error: "Too many requests", code: "RATE_LIMITED" },
      { status: 429 },
    );
    applyRateLimitHeaders(res, rl);
    return res;
  }

  try {
    const parsedQuery = availabilityQuerySchema.safeParse(getTypedSearchParams(req));

    if (!parsedQuery.success) {
      const message = parsedQuery.error.issues[0]?.message ?? "Parámetros inválidos";
      return NextResponse.json(
        { error: message, code: "INVALID_AVAILABILITY_QUERY" },
        { status: 400 },
      );
    }

    const { barberId, date, service: serviceId } = parsedQuery.data;

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
    applyRateLimitHeaders(res, rl);
    return res;
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error("Solicitud inválida");
    return NextResponse.json({ error: err.message, code: "AVAILABILITY_BAD_REQUEST" }, { status: 400 });
  }
}
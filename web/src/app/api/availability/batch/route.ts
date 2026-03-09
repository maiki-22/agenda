import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { listServices } from "@/features/booking/data/catalog.repo";
import { isAvailabilitySourceError } from "@/features/booking/data/availability.repo";
import { getAvailabilityService } from "@/features/booking/services/getAvailability";
import {
  applyRateLimitHeaders,
  availabilityBatchRatelimit,
  limitWithFailover,
} from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase/admin";

function getClientIp(req: Request) {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function validateActiveBarber(barberId: string) {
  const fetchBarber = unstable_cache(
    async () => {
      const { data, error } = await supabaseAdmin
        .from("barbers")
        .select("id")
        .eq("id", barberId)
        .eq("active", true)
        .maybeSingle();

      if (error) throw error;
      return Boolean(data?.id);
    },
    ["active-barber", barberId],
    { revalidate: 300, tags: ["barbers", `barber:${barberId}`] },
  );

  return fetchBarber();
}

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rl = await limitWithFailover({
    ratelimit: availabilityBatchRatelimit,
    key: `ip:${ip}`,
    fallbackLimit: 20,
    circuitKey: "availability-batch",
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
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get("barberId") ?? "";
    const serviceId = searchParams.get("service") ?? "";
    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";

    if (!barberId) return NextResponse.json({ error: "Missing barberId" }, { status: 400 });
    if (!from) return NextResponse.json({ error: "Missing from" }, { status: 400 });
    if (!to) return NextResponse.json({ error: "Missing to" }, { status: 400 });

    const fromDate = parseDateOnly(from);
    const toDate = parseDateOnly(to);

    if (!fromDate || !toDate) {
      return NextResponse.json(
        { error: "Invalid date range", code: "INVALID_DATE_RANGE" },
        { status: 400 },
      );
    }

    const diffDays = Math.floor((toDate.getTime() - fromDate.getTime()) / 86_400_000);
    if (diffDays < 0 || diffDays > 31) {
      return NextResponse.json(
        { error: "Invalid date range", code: "INVALID_DATE_RANGE" },
        { status: 400 },
      );
    }

    const barberIsActive = await validateActiveBarber(barberId);
    if (!barberIsActive) {
      return NextResponse.json(
        { error: "Barbero inválido", code: "INVALID_BARBER" },
        { status: 400 },
      );
    }

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

    const slotsByDate: Record<string, string[]> = {};

    for (
      let cursor = new Date(fromDate);
      cursor <= toDate;
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    ) {
      const date = formatDateOnly(cursor);
      const result = await getAvailabilityService({
        barberId,
        date,
        durationMinutes,
      });
      slotsByDate[date] = result.slots;
    }

    const res = NextResponse.json({ slotsByDate }, { status: 200 });
    applyRateLimitHeaders(res, rl);
    return res;
  } catch (e: unknown) {

    if (isAvailabilitySourceError(e)) {
      const res = NextResponse.json(
        {
          error: "No se pudo validar disponibilidad en este momento.",
          code: "AVAILABILITY_SOURCE_ERROR",
        },
        { status: 503 },
      );
      applyRateLimitHeaders(res, rl);
      return res;
    }


    const err = e instanceof Error ? e : new Error("Bad Request");
    return NextResponse.json(
      { error: err.message, code: "AVAILABILITY_BAD_REQUEST" },
      { status: 400 },
    );
  }
}
import { NextResponse } from "next/server";
import { listBarbers, listServices } from "@/features/booking/data/catalog.repo";
import { applyRateLimitHeaders, catalogRatelimit, limitWithFailover } from "@/lib/ratelimit";

function getClientIp(req: Request) {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rl = await limitWithFailover({
    ratelimit: catalogRatelimit,
    key: `ip:${ip}`,
    fallbackLimit: 120,
    circuitKey: "catalog",
  });

  if (!rl.success) {
    const res = NextResponse.json(
      { error: "Too many requests", code: "RATE_LIMITED" },
      { status: 429 },
    );
    applyRateLimitHeaders(res, rl);
    return res;
  }


  const [services, barbers] = await Promise.all([listServices(), listBarbers()]);
  const res = NextResponse.json({ services, barbers });
  applyRateLimitHeaders(res, rl);
  return res;
}
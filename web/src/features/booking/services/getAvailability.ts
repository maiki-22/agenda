import { unstable_cache } from "next/cache";
import { z } from "zod";
import { getAvailability } from "../data/availability.repo";
import type { AvailabilityResult } from "../domain/booking.types";

const QuerySchema = z.object({
  barberId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationMinutes: z.number().int().positive().optional(),
});

function cacheKey(q: { barberId: string; date: string; durationMinutes?: number }) {
  const duration = q.durationMinutes ?? 30;
  return ["availability", q.barberId, q.date, String(duration)];
}

export async function getAvailabilityService(input: unknown): Promise<AvailabilityResult> {
  const q = QuerySchema.parse(input);

  const cachedFetcher = unstable_cache(
    async () =>
      getAvailability({
        barberId: q.barberId,
        date: q.date,
        durationMinutes: q.durationMinutes,
      }),
    cacheKey(q),
    {
      revalidate: 180,
      tags: ["availability", `availability:${q.barberId}:${q.date}`],
    },
  );

  return cachedFetcher();
}
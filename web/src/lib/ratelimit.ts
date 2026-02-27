import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// POST /api/booking (crítico)
export const bookingRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(8, "1 m"), // 8/min por IP
  analytics: true,
  prefix: "rl:booking",
});

// GET /api/availability (consulta frecuente)
export const availabilityRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(90, "1 m"), // 90/min por IP
  analytics: true,
  prefix: "rl:availability",
});
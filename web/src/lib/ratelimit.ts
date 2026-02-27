import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

const redis = Redis.fromEnv();

type RateLimitSource = "upstash" | "memory-fallback" | "disabled";

type CircuitState = {
  failures: number;
  openUntil: number;
};

export type SafeRateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  source: RateLimitSource;
};

type LimitWithFailoverOptions = {
  ratelimit: Ratelimit;
  key: string;
  fallbackLimit: number;
  fallbackWindowMs?: number;
  timeoutMs?: number;
  retries?: number;
  circuitKey?: string;
};

const fallbackStore = new Map<string, { count: number; reset: number }>();
const circuitStore = new Map<string, CircuitState>();

const CIRCUIT_FAILURE_THRESHOLD = 5;
const CIRCUIT_OPEN_MS = 30_000;
const BACKOFF_BASE_MS = 50;

function nowMs() {
  return Date.now();
}

function jitter(maxMs: number) {
  return Math.floor(Math.random() * maxMs);
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function logRateLimitEvent(message: string, meta: Record<string, unknown>) {
  console.warn(`[ratelimit] ${message}`, meta);
}

function getCircuit(prefix: string): CircuitState {
  return circuitStore.get(prefix) ?? { failures: 0, openUntil: 0 };
}

function setCircuit(prefix: string, state: CircuitState) {
  circuitStore.set(prefix, state);
}

function onLimiterSuccess(prefix: string) {
  setCircuit(prefix, { failures: 0, openUntil: 0 });
}

function onLimiterFailure(prefix: string, error: unknown) {
  const current = getCircuit(prefix);
  const failures = current.failures + 1;
  const openUntil = failures >= CIRCUIT_FAILURE_THRESHOLD ? nowMs() + CIRCUIT_OPEN_MS : 0;

  setCircuit(prefix, { failures, openUntil });

  logRateLimitEvent("upstash limiter failed", {
    prefix,
    failures,
    circuitOpenUntil: openUntil,
    error: error instanceof Error ? error.message : "unknown",
  });
}

function isCircuitOpen(prefix: string) {
  const state = getCircuit(prefix);
  return state.openUntil > nowMs();
}


function bypassRateLimit(limit: number): SafeRateLimitResult {
  return {
    success: true,
    limit,
    remaining: limit,
    reset: nowMs() + 60_000,
    source: "disabled",
  };
}

function limitWithMemoryFallback(
  key: string,
  limit: number,
  windowMs: number,
): SafeRateLimitResult {
  const now = nowMs();
  const current = fallbackStore.get(key);

  if (!current || now >= current.reset) {
    fallbackStore.set(key, { count: 1, reset: now + windowMs });
    return {
      success: true,
      limit,
      remaining: Math.max(limit - 1, 0),
      reset: now + windowMs,
      source: "memory-fallback",
    };
  }

  current.count += 1;
  fallbackStore.set(key, current);

  return {
    success: current.count <= limit,
    limit,
    remaining: Math.max(limit - current.count, 0),
    reset: current.reset,
    source: "memory-fallback",
  };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Ratelimit timeout")), timeoutMs);
  });

  return Promise.race([promise, timeout]);
}

async function callUpstashWithRetry(
  ratelimit: Ratelimit,
  key: string,
  timeoutMs: number,
  retries: number,
): Promise<Awaited<ReturnType<Ratelimit["limit"]>>> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await withTimeout(ratelimit.limit(key), timeoutMs);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const backoff = BACKOFF_BASE_MS * 2 ** attempt + jitter(30);
        await sleep(backoff);
      }
    }
  }

  throw lastError;
}

export async function limitWithFailover({
  ratelimit,
  key,
  fallbackLimit,
  fallbackWindowMs = 60_000,
  timeoutMs = 250,
  retries = 1,
  circuitKey = "upstash-default",
}: LimitWithFailoverOptions): Promise<SafeRateLimitResult> {
  const prefix = circuitKey;

  if (env.rateLimitMode === "off") {
    return bypassRateLimit(fallbackLimit);
  }

  if (env.rateLimitMode === "fallback") {
    return limitWithMemoryFallback(key, fallbackLimit, fallbackWindowMs);
  }

  if (isCircuitOpen(prefix)) {
    logRateLimitEvent("circuit open, using fallback", { prefix, key });
    return limitWithMemoryFallback(key, fallbackLimit, fallbackWindowMs);
  }

  try {
    const result = await callUpstashWithRetry(ratelimit, key, timeoutMs, retries);
    onLimiterSuccess(prefix);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      source: "upstash",
    };
  } catch (error) {
    onLimiterFailure(prefix, error);
    return limitWithMemoryFallback(key, fallbackLimit, fallbackWindowMs);
  }
}

export function applyRateLimitHeaders(res: Response, rl: SafeRateLimitResult) {
  res.headers.set("RateLimit-Limit", String(rl.limit));
  res.headers.set("RateLimit-Remaining", String(rl.remaining));
  res.headers.set("RateLimit-Reset", String(rl.reset));
  res.headers.set("X-RateLimit-Source", rl.source);

  if (rl.source === "memory-fallback") {
    res.headers.set(
      "X-RateLimit-Warning",
      "upstash_unavailable_using_memory_fallback",
    );
  }

  if (rl.source === "disabled") {
    res.headers.set("X-RateLimit-Warning", "rate_limit_disabled_by_env");
  }
}

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


// GET /api/catalog (catálogo público)
export const catalogRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, "1 m"), // 120/min por IP
  analytics: true,
  prefix: "rl:catalog",
});
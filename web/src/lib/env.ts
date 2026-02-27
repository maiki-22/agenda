const RATE_LIMIT_MODES = ["upstash", "fallback", "off"] as const;

type RateLimitMode = (typeof RATE_LIMIT_MODES)[number];

function parseRateLimitMode(value: string | undefined): RateLimitMode {
  const normalized = value?.trim().toLowerCase();

  if (normalized && RATE_LIMIT_MODES.includes(normalized as RateLimitMode)) {
    return normalized as RateLimitMode;
  }

  return "upstash";
}

export const env = {
  rateLimitMode: parseRateLimitMode(process.env.RATE_LIMIT_MODE),
};

export type { RateLimitMode };
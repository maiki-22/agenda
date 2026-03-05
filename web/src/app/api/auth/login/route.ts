import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  applyRateLimitHeaders,
  authLoginRatelimit,
  limitWithFailover,
} from "@/lib/ratelimit";
import { authLoginSchema } from "@/validations/auth-login.schema";

const LOGIN_ERROR_MESSAGES = {
  rateLimit: "Demasiados intentos. Inténtalo nuevamente en unos minutos.",
  invalidPayload:
    "Ingresa un email válido y una contraseña de al menos 8 caracteres.",
  invalidCredentials: "Email o contraseña incorrectos.",
  blockedUser: "Tu cuenta está temporalmente bloqueada. Contacta soporte.",
} as const;

function getClientIp(req: Request): string {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function mapAuthErrorMessage(code?: string): string {
  if (code === "too_many_requests") return LOGIN_ERROR_MESSAGES.blockedUser;
  if (code === "invalid_credentials")
    return LOGIN_ERROR_MESSAGES.invalidCredentials;
  return LOGIN_ERROR_MESSAGES.invalidCredentials;
}

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL("/panel/login", req.url);
  return NextResponse.redirect(url, { status: 307 });
}

export async function POST(req: Request): Promise<NextResponse> {
  const ip = getClientIp(req);
  const rl = await limitWithFailover({
    ratelimit: authLoginRatelimit,
    key: `auth:ip:${ip}`,
    fallbackLimit: 6,
    circuitKey: "auth-login",
  });

  if (!rl.success) {
    const res = NextResponse.json(
      { error: LOGIN_ERROR_MESSAGES.rateLimit },
      { status: 429 },
    );
    applyRateLimitHeaders(res, rl);
    return res;
  }

  const parsed = authLoginSchema.safeParse(await req.json().catch(() => ({})));

  if (!parsed.success) {
    const res = NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 400 },
    );
    applyRateLimitHeaders(res, rl);
    return res;
  }

  const supabase = await supabaseServer();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError) {
    const message = mapAuthErrorMessage(signInError.code);
    const statusCode = signInError.code === "too_many_requests" ? 429 : 401;
    const res = NextResponse.json({ error: message }, { status: statusCode });
    applyRateLimitHeaders(res, rl);
    return res;
  }

  const res = NextResponse.json({ ok: true }, { status: 200 });
  applyRateLimitHeaders(res, rl);
  return res;
}

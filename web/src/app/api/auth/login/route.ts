import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { z } from "zod";
import { applyRateLimitHeaders, authLoginRatelimit, limitWithFailover } from "@/lib/ratelimit";


const LoginSchema = z.object({
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(128),
});

function getClientIp(req: Request) {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}


export async function GET(req: Request) {
  const url = new URL("/panel/login", req.url);
  return NextResponse.redirect(url, { status: 307 });
}


export async function POST(req: Request) {
const ip = getClientIp(req);
  const rl = await limitWithFailover({
    ratelimit: authLoginRatelimit,
    key: `auth:ip:${ip}`,
    fallbackLimit: 6,
    circuitKey: "auth-login",
  });

  if (!rl.success) {
    const res = NextResponse.json({ error: "Too many requests" }, { status: 429 });
    applyRateLimitHeaders(res, rl);
    return res;
  }

   const parsed = LoginSchema.safeParse(await req.json().catch(() => ({})));

  if (!parsed.success) {
    const res = NextResponse.json({ error: "Credenciales inválidas" }, { status: 400 });
    applyRateLimitHeaders(res, rl);
    return res;
  }

  const supabase = await supabaseServer();

    const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError) {
    const res = NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 });
    applyRateLimitHeaders(res, rl);
    return res;
  }


  const res = NextResponse.json({ ok: true }, { status: 200 });
  applyRateLimitHeaders(res, rl);
  return res;
}

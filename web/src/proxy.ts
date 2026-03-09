import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  PANEL_LOGIN_PATH,
  shouldRedirectUnauthenticated,
} from "./lib/auth/panel-route-protection";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll(): { name: string; value: string }[] {
          return request.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookiesToSet: CookieToSet[]): void {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (shouldRedirectUnauthenticated(request.nextUrl.pathname, Boolean(user))) {
    return NextResponse.redirect(new URL(PANEL_LOGIN_PATH, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/panel/:path*"],
};
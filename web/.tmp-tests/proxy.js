import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { PANEL_LOGIN_PATH, shouldRedirectUnauthenticated, } from "./lib/auth/panel-route-protection";
export async function proxy(request) {
    const response = NextResponse.next();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "", {
        cookies: {
            getAll() {
                return request.cookies.getAll().map((cookie) => ({
                    name: cookie.name,
                    value: cookie.value,
                }));
            },
            setAll(cookiesToSet) {
                for (const { name, value, options } of cookiesToSet) {
                    response.cookies.set(name, value, options);
                }
            },
        },
    });
    const { data: { user }, } = await supabase.auth.getUser();
    if (shouldRedirectUnauthenticated(request.nextUrl.pathname, Boolean(user))) {
        return NextResponse.redirect(new URL(PANEL_LOGIN_PATH, request.url));
    }
    return response;
}
export const config = {
    matcher: ["/panel/:path*"],
};

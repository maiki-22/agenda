import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function getAuthenticatedAdmin(supabase: SupabaseClient): Promise<
  | { ok: true; user: User }
  | { ok: false; status: 401 | 403; error: string }
> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return { ok: false, status: 401, error: "UNAUTHENTICATED" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (profileError) {
    return { ok: false, status: 403, error: "FORBIDDEN" };
  }

  if (profile?.role !== "admin") {
    return { ok: false, status: 403, error: "FORBIDDEN" };
  }

  return { ok: true, user: authData.user };
}
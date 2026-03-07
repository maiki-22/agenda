import type { SupabaseClient } from "@supabase/supabase-js";

type PanelRole = "admin" | "barber";

type ProfileRow = {
  role: string | null;
  barber_id: string | null;
};

type AuthFailure = {
  ok: false;
  status: 401 | 403;
  error: "UNAUTHENTICATED" | "FORBIDDEN";
};

type AuthenticatedAdminPanelUser = {
  ok: true;
  userId: string;
  role: "admin";
  barberId: null;
};

type AuthenticatedBarberPanelUser = {
  ok: true;
  userId: string;
  role: "barber";
  barberId: string;
};

export type AuthenticatedPanelUserResult =
  | AuthenticatedAdminPanelUser
  | AuthenticatedBarberPanelUser
  | AuthFailure;

function isAllowedRole(role: string | null): role is PanelRole {
  return role === "admin" || role === "barber";
}

export async function getAuthenticatedPanelUser(
  supabase: SupabaseClient,
): Promise<AuthenticatedPanelUserResult> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return { ok: false, status: 401, error: "UNAUTHENTICATED" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, barber_id")
    .eq("user_id", authData.user.id)
    .maybeSingle<ProfileRow>();

  if (profileError || !profile || !isAllowedRole(profile.role)) {
    return { ok: false, status: 403, error: "FORBIDDEN" };
  }

  if (profile.role === "barber") {
    if (!profile.barber_id) {
      return { ok: false, status: 403, error: "FORBIDDEN" };
    }

    return {
      ok: true,
      userId: authData.user.id,
      role: "barber",
      barberId: profile.barber_id,
    };
  }

  return {
    ok: true,
    userId: authData.user.id,
    role: "admin",
    barberId: null,
  };
}

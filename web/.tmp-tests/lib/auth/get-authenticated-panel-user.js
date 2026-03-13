export function isAuthenticatedPanelUser(panelUser) {
    return panelUser.ok;
}
export function isAdminPanelUser(panelUser) {
    return panelUser.ok && panelUser.role === "admin";
}
function isAllowedRole(role) {
    return role === "admin" || role === "barber";
}
export async function getAuthenticatedPanelUser(supabase) {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
        return { ok: false, status: 401, error: "UNAUTHENTICATED" };
    }
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, barber_id")
        .eq("user_id", authData.user.id)
        .maybeSingle();
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

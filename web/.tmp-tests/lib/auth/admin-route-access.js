const BARBER_PANEL_PATH = "/panel/barbero";
export function resolveAdminRouteRedirect(panelUser) {
    if (panelUser.role === "admin") {
        return null;
    }
    return BARBER_PANEL_PATH;
}

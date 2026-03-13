import type { AuthenticatedPanelUser } from "./get-authenticated-panel-user";

const BARBER_PANEL_PATH = "/panel/barbero";

export function resolveAdminRouteRedirect(
  panelUser: AuthenticatedPanelUser,
): string | null {
  if (panelUser.role === "admin") {
    return null;
  }

  return BARBER_PANEL_PATH;
}

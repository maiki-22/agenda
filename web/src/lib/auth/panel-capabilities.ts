export type PanelRole = "admin" | "barber";

export type PanelNavigationKey =
  | "agenda"
  | "bookings"
  | "blocks"
  | "my-bookings";

export type PanelNavigationEntry = {
  key: PanelNavigationKey;
  label: string;
  ariaLabel: string;
};

const PANEL_NAVIGATION_BY_ROLE: Record<PanelRole, PanelNavigationEntry[]> = {
  admin: [
    { key: "agenda", label: "Agenda", ariaLabel: "Ir a agenda del panel" },
    {
      key: "bookings",
      label: "Reservas",
      ariaLabel: "Ir a reservas del panel",
    },
    {
      key: "blocks",
      label: "Bloqueos",
      ariaLabel: "Ir a bloqueos del panel",
    },
  ],
  barber: [
    {
      key: "my-bookings",
      label: "Mis citas",
      ariaLabel: "Ir a mis citas",
    },
  ],
};

export function getPanelNavigationForRole(
  role: PanelRole,
): PanelNavigationEntry[] {
  return PANEL_NAVIGATION_BY_ROLE[role];
}

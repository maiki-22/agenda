import {
  getPanelNavigationForRole,
  type PanelNavigationEntry,
  type PanelNavigationKey,
  type PanelRole,
} from "@/lib/auth/panel-capabilities";

type NavigationIcon = {
  viewBox: string;
  path: string;
};

type NavigationItem = PanelNavigationEntry & {
  icon: NavigationIcon;
};

const ICONS_BY_KEY: Record<PanelNavigationKey, NavigationIcon> = {
  agenda: {
    viewBox: "0 0 24 24",
    path: "M4 5h7v6H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 13h7v6H4z",
  },
  bookings: {
    viewBox: "0 0 24 24",
    path: "M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  },
  blocks: {
    viewBox: "0 0 24 24",
    path: "M10 6 7 9l3 3M14 18l3-3-3-3M8 17h8M8 7h8",
  },
  "my-bookings": {
    viewBox: "0 0 24 24",
    path: "M5 7h14M5 12h14M5 17h9",
  },
};

export function getPanelNavItems(role: PanelRole): NavigationItem[] {
  return getPanelNavigationForRole(role).map((entry) => ({
    ...entry,
    icon: ICONS_BY_KEY[entry.key],
  }));
}

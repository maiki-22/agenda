# Panel Reference

## Core route files

- `web/src/app/panel/admin/page.tsx`
- `web/src/app/panel/admin/layout.tsx`
- `web/src/app/panel/admin/AdminDashboardClient.tsx`
- `web/src/app/panel/barbero/page.tsx`
- `web/src/app/panel/barbero/layout.tsx`
- `web/src/app/panel/barbero/BarberDashboardClient.tsx`
- `web/src/app/panel/login/page.tsx`
- `web/src/app/panel/login/PanelLoginForm.tsx`

## Auth and access boundaries

- `web/src/proxy.ts`
- `web/src/lib/auth/get-authenticated-panel-user.ts`
- `web/src/lib/auth/admin-route-access.ts`
- `web/src/app/api/me/route.ts`
- `web/src/app/api/auth/login/route.ts`

Use these rules:

- `proxy.ts` protects `/panel/*` at the edge layer.
- layouts re-check session and role server-side.
- route handlers must re-check session, role, and ownership before writes.

## Panel hooks

- `web/src/hooks/panel/use-overview.ts`
- `web/src/hooks/panel/use-bookings.ts`
- `web/src/hooks/panel/use-barber-panel.ts`
- `web/src/hooks/panel/use-barbers.ts`
- `web/src/hooks/panel/use-schedule.ts`
- `web/src/hooks/panel/use-panel-blocks.ts`

## Panel services

- `web/src/services/panel/overview.ts`
- `web/src/services/panel/bookings.ts`
- `web/src/services/panel/scheduling.ts`
- `web/src/services/panel/blocks.ts`
- `web/src/services/panel/barbers.ts`

Keep components away from direct database access. Route handlers and services own the contract.

## Query keys in active use

- `panel-overview`
- `panel-bookings`
- `barber-panel-bookings`
- `barber-panel-blocks`
- `barber-panel-days-off`

When changing a filter or result set, update the `queryKey` shape and invalidations together.

## UI conventions for panel work

- Use repo tokens and helper classes from `globals.css`.
- Prefer `surface-card`, `surface-card-strong`, `page-container`, `btn-gold`, `grid-times`.
- Use widget-local skeletons and retry actions instead of full-screen blockers.
- Preserve labels, `aria-*`, keyboard focus, and mobile-first layouts.

## Wireframe adaptation rule

If the wireframe mixes admin and barber features:

1. map every block to a role
2. remove admin-only operations from barber
3. keep a shared visual language, not a shared permission model

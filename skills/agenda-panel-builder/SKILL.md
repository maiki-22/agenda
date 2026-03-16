---
name: agenda-panel-builder
description: Role-aware admin and barber panel development for this Agenda repo. Use when modifying routes under /panel, dashboard layouts, bookings, blocks, schedules, SSR plus TanStack Query data flows, or when adapting a shared wireframe into separate admin and barber experiences.
---

# Agenda Panel Builder

## Overview

Implement or refactor the admin and barber panels using this repo's current pattern: protected server routes, initial server-side data, TanStack Query hooks in client components, panel services, and role-aware mutations.

## Workflow

1. Read `AGENTS.md` first, then load `references/panel-reference.md` and only the repo files needed for the task.
2. Keep the role split explicit:
   - admin manages cross-barber data and operational controls
   - barber only sees own bookings, schedule, blocks, and days off
3. Prefer the existing data flow:
   - server page/layout loads initial data
   - client component receives `initialData`
   - hooks in `web/src/hooks/panel` own `useQuery` and `useMutation`
   - services in `web/src/services/panel` own HTTP contracts
4. When changing filters, include every active filter in the `queryKey`.
5. When changing mutations, invalidate related keys and preserve empty, error, and loading states at widget level.
6. When adapting a combined wireframe, separate admin and barber responsibilities before touching layout details. Do not mirror admin-only controls into the barber surface.
7. Before finishing, run `npm run typecheck`, `npm run lint`, and `npm test` in `web/`.

## References

- Read `references/panel-reference.md` for the file map, auth boundaries, and current panel query patterns.

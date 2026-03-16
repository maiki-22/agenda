# Design Reference

## Global visual anchors

- Font: Inter via `web/src/app/layout.tsx`
- Tokens come from CSS variables, not ad-hoc palettes
- Prefer existing utility classes from `web/src/app/globals.css`

## Classes worth using first

- `page-container`
- `surface-card`
- `surface-card-strong`
- `btn-gold`
- `grid-cards`
- `grid-times`
- `footer-fixed`
- `no-scrollbar`
- `fade-up`
- `fade-in`
- `pop-in`
- `shake`

## Color and surface rules

- Use `bg-[rgb(var(--bg))]`, `bg-[rgb(var(--surface))]`, `bg-[rgb(var(--surface-2))]`
- Use `text-[rgb(var(--fg))]` and `text-[rgb(var(--muted))]`
- Use `border-[rgb(var(--border))]`
- Use `rgb(var(--primary))` and `rgb(var(--primary-foreground))` for brand actions

## Interaction rules

- Prefer `transition-colors` and `transition-transform`
- Keep `focus-visible` behavior consistent with globals
- Ensure labels and descriptive button text remain explicit

## Responsive guidance

- Start from 320px
- Use flex/grid layout, not absolute positioning for primary structure
- Keep admin denser than barber, but preserve the same visual family

## Legacy caveats

The current repo still contains some legacy `dark:` and `transition-all` usage. Do not amplify those patterns in new work unless you are intentionally refactoring the legacy surface as part of the task.

## Practical rule for shared wireframes

When a single wireframe blends admin and barber:

1. define the shared shell
2. identify admin-only blocks
3. identify barber-only blocks
4. adapt card density and actions per role
5. keep tokens, spacing, and typography coherent across both panels

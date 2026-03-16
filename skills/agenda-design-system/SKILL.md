---
name: agenda-design-system
description: Project-specific visual system for this Agenda repo. Use when designing or refactoring admin, barber, booking, or marketing UI and you need the repo's tokens, global utility classes, motion patterns, accessibility rules, and responsive conventions.
---

# Agenda Design System

## Overview

Design UI with the repo's actual visual language: CSS tokens, `globals.css` utility classes, Inter via `next/font`, responsive containers, and accessibility-first interactions.

## Workflow

1. Read `AGENTS.md`, then load `references/design-reference.md`.
2. Start from existing tokens and global utility classes before inventing new classes or inline styles.
3. Keep admin and barber visually related, but separate role-specific functions and information density.
4. Prefer component-level skeletons, empty states, and retry actions over generic spinners.
5. Respect labels, `aria-label`, keyboard focus, contrast, and mobile-first layout.
6. Avoid expanding legacy exceptions:
   - do not spread new `transition-all` usage
   - do not introduce new hardcoded color systems
   - do not create a separate dark-mode logic outside existing tokens
7. If a wireframe is shared across roles, keep the shared shell and split the operational blocks by permissions.

## References

- Read `references/design-reference.md` for the current token map, helper classes, and legacy caveats.

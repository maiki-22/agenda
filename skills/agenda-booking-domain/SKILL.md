---
name: agenda-booking-domain
description: Booking flow, availability, confirmation tokens, and appointment rules for this Agenda repo. Use when changing /reservar, booking APIs, availability queries, confirmation or cancel flows, rate limiting, Supabase appointment logic, or booking-related validations and migrations.
---

# Agenda Booking Domain

## Overview

Work on the booking experience with the repo's actual invariants in mind: shared Zod validation, Supabase-backed availability, signed confirmation tokens, rate limiting, and appointment collision handling through database logic.

## Workflow

1. Read `AGENTS.md`, then load `references/booking-reference.md`.
2. Treat `start_at`, `end_at`, and `timeslot` as the time source of truth. Do not move time logic back to legacy text fields.
3. Keep validation aligned across:
   - client forms
   - route handlers
   - shared Zod schemas
   - Supabase constraints and RPC expectations
4. Preserve booking error contracts like `SLOT_TAKEN`, `BOOKING_NOT_UPDATABLE`, and `INVALID_ACTION`.
5. Keep `service_role` usage server-only and minimize the surface touched by it.
6. Be careful with customer PII because the booking wizard persists name and phone locally.
7. Before finishing, run `npm run typecheck`, `npm run lint`, `npm test`, and the booking concurrency test when relevant.

## References

- Read `references/booking-reference.md` for domain rules, critical files, and failure modes.

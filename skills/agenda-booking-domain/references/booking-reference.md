# Booking Reference

## Critical files

- `web/src/app/api/booking/route.ts`
- `web/src/app/api/availability/route.ts`
- `web/src/app/api/availability/batch/route.ts`
- `web/src/features/booking/data/availability.repo.ts`
- `web/src/features/booking/data/catalog.repo.ts`
- `web/src/features/booking/services/getAvailability.ts`
- `web/src/features/booking/store/booking.store.ts`
- `web/src/lib/booking-confirmation-token.ts`
- `web/src/services/booking/availability.service.ts`
- `web/src/validations/booking-confirmation.schema.ts`
- `web/src/validations/booking-confirmation-endpoint.schema.ts`
- `supabase/schema.md`
- `supabase/migrations/20260309100000_fix_create_booking_insert_generated_timeslot.sql`
- `supabase/migrations/20260308150000_confirm_or_cancel_booking_by_token.sql`
- `supabase/migrations/20260308113000_appointments_input_constraints.sql`

## Domain invariants

- Use `appointments.start_at`, `appointments.end_at`, and `appointments.timeslot` for time logic.
- `appointments.date` and `appointments.time` are legacy compatibility fields.
- `barbers.id` and `services.id` are `text`, not UUID.
- Collision checks belong to DB logic and `timeslot &&`, not just client filtering.

## Booking token rules

- `BOOKING_TOKEN_SECRET` is required and must stay server-only.
- Token expiration is bounded between 24 and 48 hours in code.
- Confirmation and cancel flows depend on preserving the signed token contract.

## Rate limit and public endpoints

- Booking POST is rate-limited.
- Availability and catalog reads are rate-limited too.
- Current implementation initializes Upstash env eagerly, so missing Upstash env can still break startup even in fallback modes.

## Client architecture

- Catalog loads server-side first, then revalidates with TanStack Query.
- Availability reads use client hooks plus route handlers.
- Customer name and phone are stored in Zustand `persist`, so avoid expanding PII persistence casually.

## Verification

Run these when relevant:

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `node --test scripts/integration/booking-confirmation-concurrency.test.mjs`

Use the concurrency test when touching confirmation-by-token behavior.

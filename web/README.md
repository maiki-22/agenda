# web

Aplicacion principal del proyecto `agenda`.

## Stack actual

- Next.js 16 + App Router
- React 19
- TypeScript
- Supabase SSR + `@supabase/supabase-js`
- TanStack Query
- React Hook Form + Zod
- Tailwind CSS 4
- Zustand
- Upstash Redis / Ratelimit

## Requisitos

- Node `>=20 <21`
- npm
- Un proyecto de Supabase accesible
- Credenciales de Upstash configuradas

## Variables de entorno

Crea `web/.env` a partir de `web/.env.example`.

Variables usadas hoy por la app:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RATE_LIMIT_MODE`
- `BOOKING_TOKEN_SECRET`
- `BOOKING_TOKEN_EXPIRATION_HOURS` (opcional)

### Nota importante sobre Upstash

La implementacion actual inicializa `Redis.fromEnv()` al cargar el modulo de rate limit. En la practica, deja `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` configurados aunque uses `RATE_LIMIT_MODE=fallback` u `off`, salvo que se refactorice esa inicializacion.

## Como correrlo

```bash
cp .env.example .env
npm ci
npm run dev
```

Abrir `http://localhost:3000`.

### Nota para PowerShell en Windows

Si PowerShell bloquea `npm.ps1`, puedes usar:

```bash
npm.cmd run dev
```

o abrir la terminal `cmd`.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm test
npm run ci
```

## Como testearlo

### Checks locales

```bash
npm run typecheck
npm run lint
npm test
```

### Que cubre hoy `npm test`

El script actual compila un subconjunto de archivos a `.tmp-tests` y ejecuta pruebas de `node:test` sobre:

- proteccion de rutas del panel
- redireccion de acceso admin/barbero

Archivos principales:

- `src/proxy.test.ts`
- `src/lib/auth/admin-route-access.test.ts`

### Prueba de integracion de concurrencia

Existe una prueba manual para confirmar/cancelar reservas por token en concurrencia:

```bash
BOOKING_API_BASE_URL=http://localhost:3000 \
BOOKING_CONCURRENCY_TOKEN="<token_valido>" \
node --test scripts/integration/booking-confirmation-concurrency.test.mjs
```

Resultado esperado:

- una request `200`
- una request `409` con `BOOKING_NOT_UPDATABLE`

## Build y CI

```bash
npm run ci
```

### Nota sobre `npm run build`

El layout usa `next/font/google` con Inter. En entornos sin salida a internet, el build puede fallar al intentar descargar la fuente desde Google Fonts.

## Flujo de datos recomendado en el repo

- Server Components para carga inicial
- Client Components con TanStack Query para revalidacion
- Validacion con Zod en params, search params y payloads
- Mutaciones server-side con chequeo de sesion, rol y ownership

## Zonas sensibles del proyecto

- `src/app/api/booking/route.ts`: creacion, confirmacion y cancelacion de reservas
- `src/lib/booking-confirmation-token.ts`: firma y verificacion de tokens
- `src/lib/supabase/admin.ts`: acceso con `service_role`
- `src/lib/ratelimit.ts`: failover de rate limiting
- `supabase/schema.md`: fuente de verdad funcional para `appointments`, `timeslot`, RLS y reglas de negocio

## Notas sobre datos y tiempo

- Usa `start_at`, `end_at` y `timeslot` para logica temporal.
- `appointments.date` y `appointments.time` existen por compatibilidad, no como fuente de verdad.
- `barbers.id` y `services.id` son `text`, no UUID.

## Estado actual de setup

- El repo no incluye una configuracion completa de Supabase local versionada.
- `supabase/schema.md` y `supabase/migrations/` sirven como referencia y base de despliegue.
- Si cambias el setup o agregas nuevas variables, actualiza este README y `web/.env.example`.

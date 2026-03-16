# agenda

Agenda de citas con confirmacion por WhatsApp para una barberia local.

## Estructura

- `web/`: aplicacion Next.js App Router.
- `supabase/`: schema documentado y migraciones SQL.
- `AGENTS.md`: guia operativa y estandares del repositorio.
- `AGENT_IMPROVEMENT_LOOP.md`: registro del bucle de mejora automatica.

## Arranque rapido

```bash
cd web
cp .env.example .env
npm ci
npm run dev
```

Abre `http://localhost:3000`.

## Requisitos

- Node `>=20 <21`
- npm
- Variables de entorno configuradas en `web/.env`

## Checks utiles

```bash
cd web
npm run typecheck
npm run lint
npm test
```

## Documentacion importante

- Setup de la app: `web/README.md`
- Schema y reglas de datos: `supabase/schema.md`
- Migraciones activas: `supabase/migrations/`

## Nota sobre Supabase

El repositorio incluye schema y migraciones, pero no trae una configuracion completa de Supabase local versionada. Hoy el flujo documentado asume una instancia de Supabase ya provisionada y conectada por variables de entorno.

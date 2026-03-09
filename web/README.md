This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Rate-limit kill switch (ENV)

Puedes controlar el comportamiento global del rate limit con `RATE_LIMIT_MODE`:

- `upstash` (default): usa Upstash + failover (retry/backoff/circuit breaker + memory fallback).
- `fallback`: fuerza modo memoria local (no llama Upstash).
- `off`: desactiva el bloqueo por rate limit (solo para incidentes/operación controlada).

## Patrones de implementación por fases

### Fase 1: Login con RHF + Zod + feedback

```tsx
const form = useForm<AuthLoginInput>({
  resolver: zodResolver(authLoginSchema),
  defaultValues: { email: "", password: "" },
});

const onSubmit = async (values: AuthLoginInput): Promise<void> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    toast.error("Email o contraseña incorrectos");
    return;
  }
  toast.success("Sesión iniciada correctamente");
};
```

Referencia: `src/app/panel/login/PanelLoginForm.tsx`.

### Fase 2: Admin SSR + React Query

```tsx
// page.tsx (Server)
const overviewResult = await getOverview({ window: "next_7_days" });
return (
  <AdminDashboardClient
    initialOverview={overviewResult.success ? overviewResult.data : null}
  />
);

// hook (Client)
useQuery({
  queryKey: ["panel-overview", windowKey, selectedBarber || "all"],
  queryFn: () =>
    getOverview({ window: windowKey, barberId: selectedBarber || undefined }),
  staleTime: 30_000,
  initialData,
});
```

Referencias: `src/app/panel/admin/page.tsx`, `src/hooks/panel/use-overview.ts`, `src/hooks/panel/use-bookings.ts`.

### Fase 3: Variantes reutilizables en UI

```tsx
const buttonVariants = cva("inline-flex ...", {
  variants: {
    variant: { primary: "...", secondary: "..." },
    size: { md: "...", lg: "..." },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

<button className={buttonVariants({ variant: "secondary", size: "lg" })} />;
```

Referencias: `src/lib/cn.ts`, `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/SelectCard.tsx`.

### Fase 4: Radix (si aplica)

En este momento no hay modales/dropdowns administrativos en el alcance actual del panel. Cuando se incorporen overlays de acciones, usar primitives de Radix como estándar.

## Booking: límites de validación (alineados con DB)

Estos límites deben mantenerse sincronizados entre Zod y Supabase:

- `customer_name`: 2 a 80 caracteres, solo letras, espacios, `'`, `.` y `-`.
- `customer_phone`: formato E.164 (`+` + código país + número), largo máximo 16.
- `cancel_reason`: opcional; si se envía, máximo 280 caracteres.
- `confirmation_token`: opcional; si se persiste en DB debe ser base64url-safe (`[A-Za-z0-9_-]`) con largo entre 20 y 128.

Implementación actual:

- Schemas compartidos: `src/validations/customer-name.schema.ts`, `src/validations/customer-phone.schema.ts`, `src/validations/cancel-reason.schema.ts`, `src/validations/confirmation-token.schema.ts`.
- API booking (normalización/validación previa a RPC y update): `src/app/api/booking/route.ts`.
- Enforcements en DB: `../supabase/migrations/20260308113000_appointments_input_constraints.sql`.


## Contrato de errores backend: PATCH `/api/booking`

La actualización de estado por token usa la RPC `confirm_or_cancel_booking_by_token` y normaliza errores SQL hacia códigos de negocio estables:

| SQLSTATE | Mensaje SQL | HTTP | `code` backend | Mensaje para cliente |
| --- | --- | --- | --- | --- |
| `23P01` | `SLOT_TAKEN` | `409` | `SLOT_TAKEN` | `Horario no disponible` |
| `P0001` | `BOOKING_NOT_UPDATABLE` | `409` | `BOOKING_NOT_UPDATABLE` | `La reserva no se pudo actualizar o el token ya fue utilizado` |
| `P0001` | `INVALID_ACTION` | `400` | `INVALID_ACTION` | `Acción inválida para la reserva` |

Fallback: cualquier error no mapeado retorna `400` con `code` SQL original (o `DB_ERROR` si no existe).

### Prueba de concurrencia (integración)

Se agregó una prueba de integración para validar dos `PATCH` simultáneos al mismo token:

- Archivo: `scripts/integration/booking-confirmation-concurrency.test.mjs`
- Ejecución:

```bash
BOOKING_API_BASE_URL=http://localhost:3000 \
BOOKING_CONCURRENCY_TOKEN="<token_valido>" \
node --test scripts/integration/booking-confirmation-concurrency.test.mjs
```

Resultado esperado: una request `200` y la otra `409` con `BOOKING_NOT_UPDATABLE`.
## Content Security Policy (Report-Only)

Se configuró la cabecera `Content-Security-Policy-Report-Only` en `next.config.ts`.

### Cómo pasar de Report-Only a enforcement

Cuando quieras aplicar CSP en modo estricto (bloqueando recursos), reemplaza en `headers()`:

- `Content-Security-Policy-Report-Only` → `Content-Security-Policy`

No cambies el valor de la política al hacer este switch inicial; primero monitorea que no existan violaciones relevantes.

### Dominios incluidos y por qué

La política actual permite únicamente los orígenes mínimos detectados en el proyecto:

- `'self'`: recursos locales de la app.
- `https://fonts.googleapis.com`: hoja de estilos de `next/font/google` (Inter).
- `https://fonts.gstatic.com`: archivos de fuente de Google Fonts.
- `https://www.google.com`: `iframe` de Google Maps embebido en la landing.
- `https://<SUPABASE_HOST>` y `wss://<SUPABASE_HOST>`: tráfico de Supabase (REST/Auth/Realtime), donde `SUPABASE_HOST` se obtiene dinámicamente desde `NEXT_PUBLIC_SUPABASE_URL`.

También se permite `data:` y `blob:` solo para `img-src`, y `data:` para `font-src`, de acuerdo con la política definida.

### Cómo detectar violaciones en DevTools

1. Abre la app en el navegador y luego **DevTools** (`F12`).
2. Ve a la pestaña **Console** y filtra por `CSP` o `Content Security Policy`.
3. Busca mensajes del tipo:
   - `Refused to load ... because it violates the following Content Security Policy directive...`
4. En **Network**, revisa la respuesta del documento (`/`) y confirma que exista la cabecera:
   - `Content-Security-Policy-Report-Only`
5. Repite el flujo en rutas clave (marketing, booking, panel) para detectar orígenes no contemplados.
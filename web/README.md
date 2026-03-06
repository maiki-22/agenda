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

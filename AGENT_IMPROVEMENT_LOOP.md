# AGENT IMPROVEMENT LOOP

## Objetivo

Este archivo documenta el ciclo de mejora continua que debe seguirse después de cada cambio relevante en el repositorio. Su propósito es evitar regresiones, capturar aprendizaje técnico y dejar trazabilidad concreta de los errores corregidos.

## Bucle obligatorio

1. Ejecutar en `web/`: `npm run typecheck`, `npm run lint`, `npm test`.
2. Ejecutar `npm run build` si el entorno tiene las dependencias externas necesarias.
3. Clasificar cualquier fallo por categoría:
   - tipado
   - lint
   - test
   - build
   - entorno externo
4. Corregir primero la causa raíz y evitar parches cosméticos.
5. Reejecutar los checks afectados hasta dejarlos verdes.
6. Registrar aquí:
   - fecha
   - error detectado
   - causa raíz
   - solución aplicada
   - verificación ejecutada
   - deuda residual, si existe
7. No mezclar en el mismo commit correcciones funcionales con artefactos generados o lockfiles salvo que la actualización sea intencional.

## Registro de mejoras

### 2026-03-15 — Limpieza de lint y estabilización de tests en Windows

#### 1. `react-hooks/set-state-in-effect` en hidratación de UI

- Error detectado:
  - `web/src/components/theme/ThemeToggle.tsx`
  - `web/src/components/ui/LogoAdaptative.tsx`
- Causa raíz:
  - Se usaba `useEffect(() => setMounted(true), [])` para detectar hidratación.
- Solución aplicada:
  - Se creó `web/src/hooks/use-is-client.ts` con `useSyncExternalStore`.
  - Ambos componentes pasaron a usar `useIsClient()` en lugar de `setState` dentro de `useEffect`.
- Verificación:
  - `npm run lint`
  - `npm run typecheck`

#### 2. `react-hooks/set-state-in-effect` en animación de shake

- Error detectado:
  - `web/src/features/booking/ui/CustomerForm.tsx`
- Causa raíz:
  - El shake del input se activaba con `setShake(true)` dentro de un efecto.
- Solución aplicada:
  - Se reemplazó el estado transitorio por un `ref` al contenedor y manejo imperativo de la clase `shake`.
- Verificación:
  - `npm run lint`
  - `npm run typecheck`

#### 3. `react/no-unescaped-entities` en textos de booking

- Error detectado:
  - `web/src/features/booking/ui/DateScroller.tsx`
  - `web/src/features/booking/ui/TimeSelector.tsx`
- Causa raíz:
  - Se usaban comillas dobles sin escapar dentro de JSX.
- Solución aplicada:
  - Se reemplazaron por `&quot;`.
- Verificación:
  - `npm run lint`

#### 4. `react-hooks/incompatible-library` con React Hook Form

- Error detectado:
  - `web/src/components/panel/blocks/blocks-form.tsx`
- Causa raíz:
  - Se usaba `form.watch("type")`, que el compilador de React marca como API incompatible para memoización.
- Solución aplicada:
  - Se reemplazó por `useWatch({ control: form.control, name: "type" })`.
- Verificación:
  - `npm run lint`
  - `npm run typecheck`

#### 5. Warnings por variables no usadas y directivas obsoletas

- Error detectado:
  - `web/src/components/panel/agenda/admin-agenda-grid.tsx`
  - `web/src/hooks/panel/use-bookings.ts`
- Causa raíz:
  - Había imports, estado y mutaciones no utilizados, además de un `eslint-disable` que ya no aplicaba.
- Solución aplicada:
  - Se eliminaron imports/variables sin uso y la directiva sobrante.
- Verificación:
  - `npm run lint`

#### 6. `npm test` roto en Windows

- Error detectado:
  - `web/package.json`
- Causa raíz:
  - El script usaba `rm -rf`, que no es portable en `npm` sobre Windows.
- Solución aplicada:
  - Se reemplazó por `node -e "require('fs').rmSync(...)"`.
- Verificación:
  - `npm test`

#### 7. Test compilado ESM con import sin extensión

- Error detectado:
  - `web/src/lib/auth/admin-route-access.test.ts`
- Causa raíz:
  - El test compilado a ESM importaba `./admin-route-access` sin extensión `.js`.
- Solución aplicada:
  - Se cambió el import a `./admin-route-access.js`.
  - El script de test se ajustó para ejecutar los archivos compilados directamente.
- Verificación:
  - `npm test`

#### 8. Estado final verificado

- Checks verdes:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
- Deuda residual:
  - `npm run build` puede fallar en entornos sin salida a internet porque `next/font/google` intenta descargar Inter durante la compilación.
  - El repo todavía tiene pendiente decidir si `.tmp-tests` debe seguir versionado o no.

## Plantilla para próximas entradas

```md
### YYYY-MM-DD — Título corto

#### N. Nombre del error

- Error detectado:
  - archivo o comando
- Causa raíz:
  - descripción breve
- Solución aplicada:
  - qué se cambió
- Verificación:
  - comandos ejecutados
- Deuda residual:
  - opcional
```

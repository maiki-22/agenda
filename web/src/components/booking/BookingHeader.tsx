"use client";

import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";

/* ──────────────────────────────────────────
   SVG Icons (inline, zero deps)
────────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

/* Ícono de casa — Tabler Icons filled */
function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12.707 2.293l9 9c.63 .63 .184 1.707 -.707 1.707h-1v6a3 3 0 0 1 -3 3h-1v-7a3 3 0 0 0 -2.824 -2.995l-.176 -.005h-2a3 3 0 0 0 -3 3v7h-1a3 3 0 0 1 -3 -3v-6h-1c-.89 0 -1.337 -1.077 -.707 -1.707l9 -9a1 1 0 0 1 1.414 0m.293 11.707a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883 -.993l.117 -.007z" />
    </svg>
  );
}

/* ──────────────────────────────────────────
   Componente principal
────────────────────────────────────────── */
export default function BookingHeader({
  showBack = true,
}: {
  showBack?: boolean;
}) {
  const router = useRouter();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/90 backdrop-blur-md">
        <div className="page-container pt-[calc(env(safe-area-inset-top)+12px)] pb-3 flex items-center justify-between gap-3">

          {/* ── Acción izquierda ── */}
          {showBack ? (
            /* Botón volver: ícono SVG, hover con desplazamiento */
            <button
              type="button"
              onClick={() => router.back()}
              className="
                group h-10 w-10 rounded-2xl
                border border-[rgb(var(--border))]
                bg-[rgb(var(--surface-2))]
                text-[rgb(var(--fg))]
                grid place-items-center
                transition-all duration-200
                hover:bg-[rgb(var(--surface-3,var(--surface-2)))]
                hover:border-[rgb(var(--fg))]/20
                active:scale-95
              "
              aria-label="Volver"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
                <ArrowLeftIcon />
              </span>
            </button>
          ) : (
            /* Botón inicio: logotipo compacto con texto */
            <button
              type="button"
              onClick={() => router.push("/")}
              className="
                group h-10 w-10 rounded-2xl
                border border-[rgb(var(--border))]
                bg-[rgb(var(--surface-2))]
                text-[rgb(var(--fg))]
                grid place-items-center
                transition-all duration-200
                hover:bg-[rgb(var(--surface-3,var(--surface-2)))]
                hover:border-[rgb(var(--fg))]/20
                active:scale-95
              "
              aria-label="Volver al inicio"
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                <HomeIcon />
              </span>
            </button>
          )}

          {/* ── Centro: nombre + detalle decorativo ── */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 gap-0.5">
            <span className="text-sm font-semibold tracking-[0.12em] text-[rgb(var(--fg))] uppercase truncate">
              La Sucursal
            </span>
            {/* Separador decorativo tipo barbería */}
            <span className="flex items-center gap-1.5 opacity-40">
              <span className="block h-px w-6 bg-current" />
              <span className="text-[8px] tracking-[0.3em] uppercase font-medium">
                Barber Shop
              </span>
              <span className="block h-px w-6 bg-current" />
            </span>
          </div>

          {/* ── Acción derecha ── */}
          <ThemeToggle />
        </div>
      </header>

      {/* Spacer */}
      <div
        className="h-[calc(env(safe-area-inset-top)+64px)]"
        aria-hidden="true"
      />
    </>
  );
}
"use client";

import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function BookingHeader({
  showBack = true,
}: {
  showBack?: boolean;
}) {
  const router = useRouter();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))] supports-[backdrop-filter]:bg-[rgb(var(--bg))]/80 backdrop-blur">
        <div className="page-container pt-[calc(env(safe-area-inset-top)+12px)] pb-3 flex items-center justify-between gap-3">
          {showBack ? (
            <button
              type="button"
              onClick={() => router.back()}
              className="h-10 w-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] grid place-items-center"
              aria-label="Volver"
            >
              ←
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}

          {/* Centro: logo / marca */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            {/* Opción A: solo texto (placeholder hasta tener logo) */}
            <div className="text-sm font-semibold tracking-wide">
              La Sucursal Barber Shop
            </div>

            {/*
              Opción B: cuando tengas logo, reemplaza por:
              <img src="/logo.svg" alt="La Sucursal" className="h-8 w-auto" />
            */}
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Spacer para que el contenido no quede debajo del header fixed */}
      <div className="h-[calc(env(safe-area-inset-top)+64px)]" aria-hidden="true" />
    </>
  );
}

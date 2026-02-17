"use client";

import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function BookingHeader({
  title,
  subtitle,
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
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

        <div className="flex-1">
          {subtitle ? (
            <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
              {subtitle}
            </div>
          ) : (
            <div className="text-xs text-[rgb(var(--muted))]">Reserva</div>
          )}
          <div className="text-base font-semibold leading-tight">{title}</div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}

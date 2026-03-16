"use client";

import { useTheme } from "next-themes";
import { useIsClient } from "@/hooks/use-is-client";
import MoonHalf from "../icons/MoonHalf";
import SunIcon from "../icons/SunIcon";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group h-10 w-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] text-[rgb(var(--fg))] grid place-items-center transition-all duration-200 hover:bg-[rgb(var(--surface-3,var(--surface-2)))] hover:border-[rgb(var(--fg))]/20 active:scale-95"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      <span className="transition-transform duration-200 group-hover:scale-110">
        {isDark ? <MoonHalf size={18} /> : <SunIcon size={18} />}
      </span>
    </button>
  );
}

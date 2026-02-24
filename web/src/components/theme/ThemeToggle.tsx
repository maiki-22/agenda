"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import MoonHalf from "../icons/MoonHalf";
import SunIcon from "../icons/SunIcon";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-sm text-[rgb(var(--fg))]"
    >
      {isDark ? (
        <>
          <MoonHalf size={18} /> <span>Oscuro</span>
        </>
      ) : (
        <>
          <SunIcon size={20} /> <span>Claro</span>
        </>
      )}
    </button>
  );
}
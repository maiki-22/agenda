"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const id = setInterval(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    }, 300);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        (window as any).__toggleTheme?.();
        setIsDark((v) => !v);
      }}
      className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-sm text-[rgb(var(--fg))]"
    >
      {isDark ? "☾ Dark" : "☀ Light"}
    </button>
  );
}

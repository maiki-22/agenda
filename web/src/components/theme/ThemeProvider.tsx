"use client";

import { useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
const STORAGE_KEY = "theme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // En mount: lee preferencia guardada
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark";
    setTheme(saved);
  }, []);

  // Cada cambio: aplica class en <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <>
      {/* Exponemos setter por evento global simple (MVP) */}
      <ThemeBridge
        onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />
      {children}
    </>
  );
}

function ThemeBridge({ onToggle }: { onToggle: () => void }) {
  useEffect(() => {
    (window as any).__toggleTheme = onToggle;
    return () => {
      delete (window as any).__toggleTheme;
    };
  }, [onToggle]);

  return null;
}

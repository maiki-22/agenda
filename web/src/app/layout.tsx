import "./globals.css";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Agenda Barbería",
  description: "Reserva tu hora en minutos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`dark ${inter.variable}`}>
      <body className="min-h-dvh bg-[rgb(var(--bg))] text-[rgb(var(--fg))] antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

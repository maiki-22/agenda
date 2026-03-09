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
  title: "La Sucursal Barber Shop - Reserva tu hora en minutos",
  description:
    "Reserva tu cita en La Sucursal Barber Shop de forma rápida y sencilla. Elige tu servicio, selecciona a tu barbero favorito y encuentra el horario que mejor se adapte a ti. ¡Tu próxima experiencia de barbería está a solo unos clics de distancia!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-dvh bg-[rgb(var(--bg))] text-[rgb(var(--fg))] antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

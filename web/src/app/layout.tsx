import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Agenda Barbería",
  description: "Reserva tu hora en minutos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
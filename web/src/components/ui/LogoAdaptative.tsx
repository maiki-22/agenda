"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import logoBlanco from "../../../public/logo-blanco.png";
import logoNegro from "../../../public/logo-negro.png";

export default function LogoAdaptive({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(true); // dark es el modo por defecto
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Lee si el html tiene la clase "dark" directamente del DOM
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    update(); // lectura inicial
    setMounted(true);

    // Observa cambios en las clases del <html> (cuando el usuario cambia el tema)
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) return <div className={className} />;

  return (
    <div className={`relative ${className}`}>
      <Image
        src={isDark ? logoBlanco : logoNegro}
        alt="La Sucursal Barber Shop"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}

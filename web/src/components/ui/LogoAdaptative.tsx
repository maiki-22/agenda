"use client";
import { useEffect, useState } from "react";
import LogoSvg from "@/../public/LogoLaSucursal.svg";

export default function LogoAdaptive({
  className = "",
}: {
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={className} />;

  return (
    <div className={`text-[rgb(var(--fg))] ${className}`}>
      <LogoSvg
        className="block w-full h-auto"
        aria-label="La Sucursal Barber Shop"
      />
    </div>
  );
}

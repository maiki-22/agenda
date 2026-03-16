"use client";
import LogoSvg from "@/../public/logo.svg";
import { useIsClient } from "@/hooks/use-is-client";

export default function LogoAdaptive({
  className = "",
}: {
  className?: string;
}) {
  const isClient = useIsClient();

  if (!isClient) return <div className={className} />;

  return (
    <div className={`text-[rgb(var(--fg))] ${className}`}>
      <LogoSvg
        className="block h-auto w-full"
        aria-label="La Sucursal Barber Shop"
      />
    </div>
  );
}

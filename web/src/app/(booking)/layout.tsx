import type { ReactNode } from "react";

export default function BookingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-dvh relative overflow-x-hidden">
      
      <div className="fixed inset-0 -z-10 bg-[rgb(var(--bg))]" />

      
      <div
        className="fixed -z-10 pointer-events-none"
        style={{
          top: "-10rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(24rem, 50vw, 56rem)",
          height: "clamp(24rem, 50vw, 56rem)",
          borderRadius: "9999px",
          background: "rgb(var(--primary) / 0.18)",
          filter: "blur(80px)",
        }}
      />

      {/* Glow claro inferior-izquierdo */}
      <div
        className="fixed -z-10 pointer-events-none"
        style={{
          bottom: "-8rem",
          left: "-8rem",
          width: "clamp(18rem, 30vw, 36rem)",
          height: "clamp(18rem, 30vw, 36rem)",
          borderRadius: "9999px",
          background: "rgb(255 255 255 / 0.06)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative min-h-dvh">{children}</div>
    </div>
  );
}
import type { ReactNode } from "react";
import { PanelQueryClientProvider } from "@/components/providers/query-client-provider";

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
          background: "rgb(var(--bg-ambient-2))",
          filter: "blur(80px)",
        }}
      />

       {/* Glow ambiental inferior-izquierdo */}
      <div
        className="fixed -z-10 pointer-events-none"
        style={{
          bottom: "-8rem",
          left: "-8rem",
          width: "clamp(18rem, 30vw, 36rem)",
          height: "clamp(18rem, 30vw, 36rem)",
          borderRadius: "9999px",
          background: "rgb(var(--bg-ambient-3))",
          filter: "blur(80px)",
        }}
      />

      <PanelQueryClientProvider>
        <div className="relative min-h-dvh">{children}</div>
      </PanelQueryClientProvider>
    </div>
  );
}
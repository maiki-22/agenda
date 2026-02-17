import type { ReactNode } from "react";

export default function BookingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md min-h-dvh relative overflow-hidden">
      <div className="absolute inset-0 bg-[rgb(var(--bg))]" />
      <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[rgb(var(--primary))]/20 blur-3xl" />
      <div className="absolute bottom-[-120px] left-[-120px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="relative min-h-dvh">{children}</div>
    </div>
  );
}

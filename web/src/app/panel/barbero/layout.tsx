import type { ReactNode } from "react";
import { PanelQueryClientProvider } from "@/components/providers/query-client-provider";

interface BarberLayoutProps {
  children: ReactNode;
}

export default function BarberLayout({ children }: BarberLayoutProps) {
  return <PanelQueryClientProvider>{children}</PanelQueryClientProvider>;
}
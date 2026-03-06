import type { ReactNode } from "react";
import { PanelQueryClientProvider } from "@/components/providers/query-client-provider";

interface PanelLayoutProps {
  children: ReactNode;
}

export default function PanelLayout({ children }: PanelLayoutProps) {
  return <PanelQueryClientProvider>{children}</PanelQueryClientProvider>;
}
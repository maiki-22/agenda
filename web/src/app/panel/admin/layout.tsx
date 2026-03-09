import type { ReactElement, ReactNode } from "react";
import { redirect } from "next/navigation";
import { PanelQueryClientProvider } from "@/components/providers/query-client-provider";
import { PanelHeader } from "@/components/panel/panel-header";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { supabaseServer } from "@/lib/supabase/server";

interface PanelLayoutProps {
  children: ReactNode;
}

export default async function PanelLayout({
  children,
}: PanelLayoutProps): Promise<ReactElement> {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!panelUser.ok) {
    redirect("/panel/login");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userEmail = userData.user?.email;

  if (userError || !userEmail) {
    redirect("/panel/login");
  }

  return (
    <PanelQueryClientProvider>
      <PanelHeader role={panelUser.role} />
      <main className="page-container py-4 sm:py-6">{children}</main>
    </PanelQueryClientProvider>
  );
}

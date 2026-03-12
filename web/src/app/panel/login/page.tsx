import { redirect } from "next/navigation";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { supabaseServer } from "@/lib/supabase/server";
import { PanelLoginForm } from "./PanelLoginForm";

export default async function PanelLoginPage() {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (panelUser.ok) {
    redirect(panelUser.role === "admin" ? "/panel/admin" : "/panel/barbero");
  }

  return (
    <main className="min-h-[100dvh]">
      <section className="page-container flex min-h-[100dvh] items-center justify-center py-6 sm:py-10">
        <div className="surface-card pop-in w-full max-w-sm rounded-[var(--card-radius)] p-6 sm:p-8">
          <div className="mb-6 flex min-w-0 flex-col items-center justify-center gap-0.5 text-center">
            <span className="truncate text-sm font-semibold uppercase tracking-[0.12em] text-[rgb(var(--fg))]">
              La Sucursal
            </span>
            <span className="flex items-center gap-1.5 text-[rgb(var(--muted))] opacity-60">
              <span className="block h-px w-6 bg-current" />
              <span className="text-[8px] font-medium uppercase tracking-[0.3em]">
                Barber Shop
              </span>
              <span className="block h-px w-6 bg-current" />
            </span>
          </div>
          <PanelLoginForm />
        </div>
      </section>
    </main>
  );
}

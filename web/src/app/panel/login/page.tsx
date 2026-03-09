import { redirect } from "next/navigation";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { supabaseServer } from "@/lib/supabase/server";
import { PanelLoginForm } from "./PanelLoginForm";

const TRUST_BADGES = [
  "Acceso seguro con sesión validada en servidor",
  "Monitoreo activo del estado de autenticación",
  "Soporte rápido para recuperación de acceso",
] as const;

export default async function PanelLoginPage() {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (panelUser.ok) {
    redirect(panelUser.role === "admin" ? "/panel/admin" : "/panel/barbero");
  }

  return (
    <main className="page-container py-8 sm:py-12">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-stretch">
        <aside className="rounded-[var(--card-radius)] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-[var(--shadow-soft)] sm:p-6 lg:p-8">
          <p className="text-xs tracking-widest uppercase text-[rgb(var(--muted))]">
            Acceso seguro
          </p>
          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Panel administrador
          </h1>
          <p className="mt-3 text-sm text-[rgb(var(--muted))] sm:text-base">
            Gestiona reservas y operación diaria desde un entorno protegido.
            Inicia sesión para continuar con tu flujo de trabajo.
          </p>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium">Estado de sesión</p>
            <p className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-2 text-sm text-[rgb(var(--muted))]">
              Actualmente no hay una sesión activa en este dispositivo.
            </p>
          </div>
        </aside>

        <div className="rounded-[var(--card-radius)] border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5 shadow-[var(--shadow-medium)] sm:p-6 lg:p-8">
          <div className="mb-6 space-y-2 text-center lg:text-left">
            <p className="text-xs tracking-widest uppercase text-[rgb(var(--muted))]">
              Inicio de sesión
            </p>
            <h2 className="text-xl font-semibold sm:text-2xl">
              Bienvenido de vuelta
            </h2>
            <p className="text-sm text-[rgb(var(--muted))]">
              Ingresa con tu cuenta de administrador para acceder al panel.
            </p>
          </div>
          <PanelLoginForm />
        </div>
      </section>
    </main>
  );
}

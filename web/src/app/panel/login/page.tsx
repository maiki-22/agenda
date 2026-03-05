import { PanelLoginForm } from "./PanelLoginForm";


export default function PanelLoginPage() {
  return (
    <main className="page-container py-8 sm:py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
        <div className="space-y-2 text-center mb-6">
          <p className="text-xs tracking-widest uppercase text-[rgb(var(--muted))]">Acceso seguro</p>
          <h1 className="text-2xl font-bold">Panel administrador</h1>
          <p className="text-sm text-[rgb(var(--muted))]">Ingresa con tu cuenta de administrador para continuar.</p>
        </div>

        <PanelLoginForm />
      </div>
    </main>
  );
}
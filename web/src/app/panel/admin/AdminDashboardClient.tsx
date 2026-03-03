"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Barber = { id: string; name: string; active: boolean };
type SummaryByBarber = {
  barber_id: string;
  barber_name: string;
  total: number;
  confirmed: number;
  pending: number;
};

type OverviewResponse = {
  totals: { total: number; confirmed: number; pending: number; cancelled: number };
  by_barber: SummaryByBarber[];
  barbers: Barber[];
};

export function AdminDashboardClient() {
  const [range, setRange] = useState<"week" | "month">("week");
  const [barberId, setBarberId] = useState<string>("all");
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const [dayOffDate, setDayOffDate] = useState("");
  const [dayOffReason, setDayOffReason] = useState("");

  const [closedDate, setClosedDate] = useState("");
  const [closedReason, setClosedReason] = useState("");

  const selectedBarber = useMemo(() => {
    if (barberId === "all") return "";
    return barberId;
  }, [barberId]);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const params = new URLSearchParams({ range });
      if (selectedBarber) params.set("barberId", selectedBarber);
      const res = await fetch(`/api/panel/overview?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "No se pudo cargar el dashboard");
      setOverview(json as OverviewResponse);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }, [range, selectedBarber]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const send = async (url: string, body: unknown) => {
    setMessage("");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error ?? "No se pudo guardar");
    await loadOverview();
  };

  return (
    <main className="page-container py-6 sm:py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs tracking-widest uppercase text-[rgb(var(--muted))]">Panel administrador</p>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard de gestión</h1>
      </header>

      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5 grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-[rgb(var(--muted))]">Resumen</span>
          <select value={range} onChange={(e) => setRange(e.target.value as "week" | "month")} className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2">
            <option value="week">Semanal</option>
            <option value="month">Mensual</option>
          </select>
        </label>

        <label className="space-y-1 text-sm sm:col-span-2">
          <span className="text-[rgb(var(--muted))]">Barbero</span>
          <select value={barberId} onChange={(e) => setBarberId(e.target.value)} className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2">
            <option value="all">Todos</option>
            {(overview?.barbers ?? []).map((barber) => (
              <option key={barber.id} value={barber.id}>{barber.name} {barber.active ? "" : "(inactivo)"}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total citas" value={overview?.totals.total ?? 0} />
        <StatCard label="Confirmadas" value={overview?.totals.confirmed ?? 0} />
        <StatCard label="Pendientes" value={overview?.totals.pending ?? 0} />
        <StatCard label="Canceladas" value={overview?.totals.cancelled ?? 0} />
      </section>

      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:p-5">
        <h2 className="font-semibold mb-3">Desempeño por barbero</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[rgb(var(--muted))] border-b border-[rgb(var(--border))]">
                <th className="py-2 pr-4">Barbero</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Confirmadas</th>
                <th className="py-2 pr-4">Pendientes</th>
                <th className="py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {(overview?.by_barber ?? []).map((row) => {
                const barber = overview?.barbers.find((b) => b.id === row.barber_id);
                return (
                  <tr key={row.barber_id} className="border-b border-[rgb(var(--border))]">
                    <td className="py-2 pr-4">{row.barber_name}</td>
                    <td className="py-2 pr-4">{row.total}</td>
                    <td className="py-2 pr-4">{row.confirmed}</td>
                    <td className="py-2 pr-4">{row.pending}</td>
                    <td className="py-2">
                      <button
                        onClick={async () => {
                          if (!barber) return;
                          try {
                            const res = await fetch(`/api/panel/barbers/${barber.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ active: !barber.active }),
                            });
                            const json = await res.json();
                            if (!res.ok) throw new Error(json?.error ?? "No se pudo actualizar");
                            await loadOverview();
                          } catch (error) {
                            setMessage(error instanceof Error ? error.message : "Error inesperado");
                          }
                        }}
                        className="rounded-lg border border-[rgb(var(--border))] px-3 py-1"
                      >
                        {barber?.active ? "Deshabilitar" : "Habilitar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <form className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2" onSubmit={async (e) => {
          e.preventDefault();
          if (!selectedBarber) return setMessage("Selecciona un barbero para bloquear horario");
          try {
            await send("/api/panel/barber-blocks", {
              barber_id: selectedBarber,
              date: blockDate,
              start_at: `${blockDate}T${blockStart}:00-03:00`,
              end_at: `${blockDate}T${blockEnd}:00-03:00`,
              reason: blockReason,
            });
            setMessage("Horario bloqueado correctamente");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Error inesperado");
          }
        }}>
          <h3 className="font-semibold">Bloquear horario</h3>
          <input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} className="w-full rounded-xl border border-[rgb(var(--border))] px-3 py-2" required />
          <div className="grid grid-cols-2 gap-2">
            <input type="time" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} className="rounded-xl border border-[rgb(var(--border))] px-3 py-2" required />
            <input type="time" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} className="rounded-xl border border-[rgb(var(--border))] px-3 py-2" required />
          </div>
          <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Motivo" className="w-full rounded-xl border border-[rgb(var(--border))] px-3 py-2" />
          <button className="rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] px-3 py-2">Guardar</button>
        </form>

        <form className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2" onSubmit={async (e) => {
          e.preventDefault();
          if (!selectedBarber) return setMessage("Selecciona un barbero para día libre");
          try {
            await send("/api/panel/barber-days-off", { barber_id: selectedBarber, date: dayOffDate, reason: dayOffReason });
            setMessage("Día libre agregado correctamente");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Error inesperado");
          }
        }}>
          <h3 className="font-semibold">Día libre por barbero</h3>
          <input type="date" value={dayOffDate} onChange={(e) => setDayOffDate(e.target.value)} className="w-full rounded-xl border border-[rgb(var(--border))] px-3 py-2" required />
          <input type="text" value={dayOffReason} onChange={(e) => setDayOffReason(e.target.value)} placeholder="Motivo" className="w-full rounded-xl border border-[rgb(var(--border))] px-3 py-2" />
          <button className="rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] px-3 py-2">Guardar</button>
        </form>

        <form className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 space-y-2" onSubmit={async (e) => {
          e.preventDefault();
          try {
            await send("/api/panel/shop-closed-days", { date: closedDate, reason: closedReason });
            setMessage("Día cerrado agregado correctamente");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Error inesperado");
          }
        }}>
          <h3 className="font-semibold">Cerrar barbería (día completo)</h3>
          <input type="date" value={closedDate} onChange={(e) => setClosedDate(e.target.value)} className="w-full rounded-xl border border-[rgb(var(--border))] px-3 py-2" required />
          <input type="text" value={closedReason} onChange={(e) => setClosedReason(e.target.value)} placeholder="Motivo (feriado, imprevisto...)" className="w-full rounded-xl border border-[rgb(var(--border))] px-3 py-2" />
          <button className="rounded-xl bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] px-3 py-2">Guardar</button>
        </form>
      </section>

      {loading && <p className="text-sm text-[rgb(var(--muted))]">Cargando datos...</p>}
      {message && <p className="text-sm">{message}</p>}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4">
      <p className="text-xs tracking-widest uppercase text-[rgb(var(--muted))]">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </article>
  );
}
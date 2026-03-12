import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { formatDateInSantiago, getSantiagoDayBounds } from "@/lib/datetime/santiago";
import { supabaseServer } from "@/lib/supabase/server";

type AppointmentRow = { barber_id: string; status: string; start_at: string };
type WindowKey = "today" | "next_7_days" | "next_30_days" | "custom";
type DateWindow = { startDate: string; endDate: string };
type Summary = { total: number; confirmed: number; pending: number; cancelled: number };
type BarberSummary = Summary & { barber_id: string; barber_name: string };
type DateSummary = Summary & { date: string };

const paramsSchema = z.object({
  window: z.enum(["today", "next_7_days", "next_30_days", "custom"]).default("today"),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

const PENDING_STATUSES = new Set(["booked", "needs_confirmation"]);

function isoDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDateWindow(window: Exclude<WindowKey, "custom">): DateWindow {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  const end = new Date(today);

  if (window === "next_7_days") end.setDate(today.getDate() + 6);
  if (window === "next_30_days") end.setDate(today.getDate() + 29);
 
  return { startDate: isoDateOnly(start), endDate: isoDateOnly(end) };
}

function getCustomDateWindow(startDate?: string, endDate?: string): DateWindow | null {
  if (!startDate || !endDate || startDate > endDate) return null;
  return { startDate, endDate };
}

function createSummary(): Summary {
  return { total: 0, confirmed: 0, pending: 0, cancelled: 0 };
}

function addRow(summary: Summary, status: string): void {
  summary.total += 1;
  if (status === "confirmed") summary.confirmed += 1;
  if (status === "cancelled") summary.cancelled += 1;
  if (PENDING_STATUSES.has(status)) summary.pending += 1;
}

function mapRows(rows: AppointmentRow[], barberMap: Map<string, string>): { byBarber: Record<string, BarberSummary>; byDate: Record<string, DateSummary> } {
  const byBarber: Record<string, BarberSummary> = {};
  const byDate: Record<string, DateSummary> = {};

  for (const row of rows) {
    if (!byBarber[row.barber_id]) {
      byBarber[row.barber_id] = {
        barber_id: row.barber_id,
        barber_name: barberMap.get(row.barber_id) ?? row.barber_id,
        ...createSummary(),
      };
    }

    const rowDate = formatDateInSantiago(row.start_at);
    if (!byDate[rowDate]) byDate[rowDate] = { date: rowDate, ...createSummary() };

    addRow(byBarber[row.barber_id], row.status);
    addRow(byDate[rowDate], row.status);
  }

  return { byBarber, byDate };
}

export async function GET(req: Request): Promise<Response> {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);
  if (!panelUser.ok) return NextResponse.json({ error: panelUser.error }, { status: panelUser.status });
  if (panelUser.role !== "admin") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const parsedParams = paramsSchema.safeParse({
    window: searchParams.get("window") ?? "today",
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
  });
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Parámetros inválidos para el resumen" }, { status: 400 });
  }


  const barberId = searchParams.get("barberId") ?? "";
  const { window, startDate, endDate } = parsedParams.data;
  const dateWindow = window === "custom" ? getCustomDateWindow(startDate, endDate) : getDateWindow(window);
  if (!dateWindow) {
    return NextResponse.json(
      { error: "Para la ventana personalizada debes indicar un rango de fechas válido" },
      { status: 400 },
    );
  }

  const { startAtIso: startAtFrom } = getSantiagoDayBounds(dateWindow.startDate);
  const { endAtIso: startAtTo } = getSantiagoDayBounds(dateWindow.endDate);

  const [
    { data: barbers, error: barbersError },
    { data: appointments, error: appointmentsError },
  ] = await Promise.all([
    supabase.from("barbers").select("id, name, active, sort_order").order("sort_order", { ascending: true }),
    supabase
      .from("appointments")
      .select("barber_id, status, start_at")
      .gte("start_at", startAtFrom)
      .lte("start_at", startAtTo)
      .order("start_at", { ascending: true }),
  ] as const);

  if (barbersError || appointmentsError) {
    return NextResponse.json({ error: barbersError?.message ?? appointmentsError?.message ?? "Query error" }, { status: 400 });
  }

  const barberMap = new Map((barbers ?? []).map((barber) => [barber.id, barber.name]));
  const rows: AppointmentRow[] = (appointments ?? []).filter((row) => (barberId ? row.barber_id === barberId : true));

  const totals = rows.reduce<Summary>((acc, row) => {
    addRow(acc, row.status);
    return acc;
  }, createSummary());

  const rates = {
    confirmation_rate: totals.total ? Number(((totals.confirmed / totals.total) * 100).toFixed(1)) : 0,
    cancellation_rate: totals.total ? Number(((totals.cancelled / totals.total) * 100).toFixed(1)) : 0,
  };

 const { byBarber, byDate } = mapRows(rows, barberMap);

  return NextResponse.json(
    {
      ok: true,
      window,
      date_window: dateWindow,
      totals,
      rates,
      by_barber: Object.values(byBarber).sort((a, b) => b.total - a.total),
      by_date: Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date)),
      barbers: barbers ?? [],
      meta: {
        filters: { window, barberId: barberId || "all" },
        counts: { raw_appointments: (appointments ?? []).length, filtered_appointments: rows.length },
        generated_at: new Date().toISOString(),
      },
    },
    { status: 200 },
  );
}

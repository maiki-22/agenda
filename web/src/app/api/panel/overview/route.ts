import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/isAdmin";

type AppointmentRow = {
  barber_id: string;
  status: string;
  date: string;
};

function daysBackFrom(range: string | null) {
  if (range === "month") return 30;
  return 7;
}

function isoDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  const supabase = await supabaseServer();
  const admin = await getAuthenticatedAdmin(supabase);

  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range");
  const barberId = searchParams.get("barberId");

  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (daysBackFrom(range) - 1));

  const startDate = isoDateOnly(start);
  const endDate = isoDateOnly(end);

  const [{ data: barbers, error: barbersError }, { data: appointments, error: appointmentsError }] = await Promise.all([
    supabase.from("barbers").select("id, name, active, sort_order").order("sort_order", { ascending: true }),
    supabase
      .from("appointments")
      .select("barber_id, status, date")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true }),
  ]);

  if (barbersError || appointmentsError) {
    return NextResponse.json(
      { error: barbersError?.message ?? appointmentsError?.message ?? "Query error" },
      { status: 400 },
    );
  }

  const barberMap = new Map((barbers ?? []).map((b) => [b.id, b.name]));
  const rows = ((appointments ?? []) as AppointmentRow[]).filter((row) =>
    barberId ? row.barber_id === barberId : true,
  );

  const totals = {
    total: rows.length,
    confirmed: rows.filter((r) => r.status === "confirmed").length,
    pending: rows.filter((r) => r.status === "pending").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };

  const byBarber: Record<string, { barber_id: string; barber_name: string; total: number; confirmed: number; pending: number }> = {};

  for (const row of rows) {
    if (!byBarber[row.barber_id]) {
      byBarber[row.barber_id] = {
        barber_id: row.barber_id,
        barber_name: barberMap.get(row.barber_id) ?? row.barber_id,
        total: 0,
        confirmed: 0,
        pending: 0,
      };
    }

    byBarber[row.barber_id].total += 1;
    if (row.status === "confirmed") byBarber[row.barber_id].confirmed += 1;
    if (row.status === "pending") byBarber[row.barber_id].pending += 1;
  }

  return NextResponse.json(
    {
      ok: true,
      range: range === "month" ? "month" : "week",
      date_window: { startDate, endDate },
      totals,
      by_barber: Object.values(byBarber).sort((a, b) => b.total - a.total),
      barbers: barbers ?? [],
    },
    { status: 200 },
  );
}
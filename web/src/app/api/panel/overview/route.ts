import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { formatDateInSantiago, getSantiagoDayBounds } from "@/lib/datetime/santiago";

type AppointmentRow = {
  barber_id: string;
  status: string;
  start_at: string;
};

const PENDING_STATUSES = new Set(["booked", "needs_confirmation"]);

type WindowKey =
  | "next_7_days"
  | "next_30_days"
  | "last_7_days"
  | "last_30_days";

function isoDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDateWindow(window: WindowKey) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  const end = new Date(today);

  if (window === "next_7_days") end.setDate(today.getDate() + 6);
  if (window === "next_30_days") end.setDate(today.getDate() + 29);
  if (window === "last_7_days") start.setDate(today.getDate() - 6);
  if (window === "last_30_days") start.setDate(today.getDate() - 29);

  return { startDate: isoDateOnly(start), endDate: isoDateOnly(end) };
}

function resolveWindow(
  windowParam: string | null,
  legacyRange: string | null,
): WindowKey {
  if (
    windowParam === "next_7_days" ||
    windowParam === "next_30_days" ||
    windowParam === "last_7_days" ||
    windowParam === "last_30_days"
  ) {
    return windowParam;
  }

  if (legacyRange === "month") return "last_30_days";
  return "last_30_days";
}

export async function GET(req: Request): Promise<Response> {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!panelUser.ok) {
    return NextResponse.json(
      { error: panelUser.error },
      { status: panelUser.status },
    );
  }

  if (panelUser.role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const window = resolveWindow(
    searchParams.get("window"),
    searchParams.get("range"),
  );
  const barberId = searchParams.get("barberId") ?? "";

  const { startDate, endDate } = getDateWindow(window);
  const { startAtIso: startAtFrom } = getSantiagoDayBounds(startDate);
  const { endAtIso: startAtTo } = getSantiagoDayBounds(endDate);

  const barbersQuery = supabase
    .from("barbers")
    .select("id, name, active, sort_order")
    .order("sort_order", { ascending: true });
  const appointmentsQuery = supabase
    .from("appointments")
    .select("barber_id, status, start_at")
    .gte("start_at", startAtFrom)
    .lte("start_at", startAtTo)
    .order("start_at", { ascending: true });

  const [
    { data: barbers, error: barbersError },
    { data: appointments, error: appointmentsError },
  ] = await Promise.all([barbersQuery, appointmentsQuery] as const);
  if (barbersError || appointmentsError) {
    return NextResponse.json(
      {
        error:
          barbersError?.message ?? appointmentsError?.message ?? "Query error",
      },
      { status: 400 },
    );
  }

  const barberMap = new Map((barbers ?? []).map((b) => [b.id, b.name]));
  const rows: AppointmentRow[] = (appointments ?? []).filter((row) =>
    barberId ? row.barber_id === barberId : true,
  );

  const totals = {
    total: rows.length,
    confirmed: rows.filter((r) => r.status === "confirmed").length,
    pending: rows.filter((r) => PENDING_STATUSES.has(r.status)).length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };

  const rates = {
    confirmation_rate: totals.total
      ? Number(((totals.confirmed / totals.total) * 100).toFixed(1))
      : 0,
    cancellation_rate: totals.total
      ? Number(((totals.cancelled / totals.total) * 100).toFixed(1))
      : 0,
  };

  const byBarber: Record<
    string,
    {
      barber_id: string;
      barber_name: string;
      total: number;
      confirmed: number;
      pending: number;
      cancelled: number;
    }
  > = {};
  const byDate: Record<
    string,
    {
      date: string;
      total: number;
      confirmed: number;
      pending: number;
      cancelled: number;
    }
  > = {};

  for (const row of rows) {
    if (!byBarber[row.barber_id]) {
      byBarber[row.barber_id] = {
        barber_id: row.barber_id,
        barber_name: barberMap.get(row.barber_id) ?? row.barber_id,
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
      };
    }

    const rowDate = formatDateInSantiago(row.start_at);

    if (!byDate[rowDate]) {
      byDate[rowDate] = {
        date: rowDate,
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
      };
    }

     byBarber[row.barber_id].total += 1;
     byDate[rowDate].total += 1;

    if (row.status === "confirmed") {
      byBarber[row.barber_id].confirmed += 1;
      byDate[rowDate].confirmed += 1;
    }

    if (PENDING_STATUSES.has(row.status)) {
      byBarber[row.barber_id].pending += 1;
      byDate[rowDate].pending += 1;
    }

    if (row.status === "cancelled") {
      byBarber[row.barber_id].cancelled += 1;
      byDate[rowDate].cancelled += 1;
    }
  }

  return NextResponse.json(
    {
      ok: true,
      window,
      date_window: { startDate, endDate },
      totals,
      rates,
      by_barber: Object.values(byBarber).sort((a, b) => b.total - a.total),
      by_date: Object.values(byDate).sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
      barbers: barbers ?? [],
      meta: {
        filters: { window, barberId: barberId || "all" },
        counts: {
          raw_appointments: (appointments ?? []).length,
          filtered_appointments: rows.length,
        },
        generated_at: new Date().toISOString(),
      },
    },
    { status: 200 },
  );
}

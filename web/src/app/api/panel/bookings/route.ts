import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";

import { getTypedSearchParams } from "@/lib/search-params";
import { panelBookingsQuerySchema } from "@/validations/panel-bookings-query.schema";

type BookingRow = {
  id: string;
  date: string;
  time: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  barber_id: string;
  service_id: string;
  barbers: { name: string }[] | null;
  services: { name: string }[] | null;
};

export async function GET(req: Request) {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!panelUser.ok) {
    return NextResponse.json(
      { error: panelUser.error },
      { status: panelUser.status },
    );
  }

 

const parsedQuery = panelBookingsQuerySchema.safeParse(
    getTypedSearchParams(req),
  );

  if (!parsedQuery.success) {
    const message = parsedQuery.error.issues[0]?.message ?? "Parámetros inválidos";
    return NextResponse.json(
      { error: message, code: "INVALID_PANEL_BOOKINGS_QUERY" },
      { status: 400 },
    );
  }

  const { dateFrom, dateTo, barberId, status, q, page, pageSize } = parsedQuery.data;

  let query = supabase
    .from("appointments")
    .select(
      `
      id,
      date,
      time,
      status,
      customer_name,
      customer_phone,
      barber_id,
      service_id,
      barbers(name),
      services(name)
    `,
      { count: "exact" },
    )
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (dateFrom) query = query.gte("date", dateFrom);
  if (dateTo) query = query.lte("date", dateTo);
  if (panelUser.role === "barber") {
    query = query.eq("barber_id", panelUser.barberId);
  } else if (barberId && barberId !== "all") {
    query = query.eq("barber_id", barberId);
  }
  if (status !== "all") query = query.eq("status", status);

  if (q) {
    const escaped = q.replace(/[%_]/g, "");
    query = query.or(
      `customer_name.ilike.%${escaped}%,customer_phone.ilike.%${escaped}%`,
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message, code: "PANEL_BOOKINGS_QUERY_ERROR" }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: true,
      page,
      pageSize,
      total: count ?? 0,
      items: ((data ?? []) as BookingRow[]).map((item) => ({
        id: item.id,
        date: item.date,
        time: item.time,
        status: item.status,
        customer_name: item.customer_name,
        customer_phone: item.customer_phone,
        barber_id: item.barber_id,
        barber_name: item.barbers?.[0]?.name ?? item.barber_id,
        service_id: item.service_id,
        service_name: item.services?.[0]?.name ?? item.service_id,
      })),
    },
    { status: 200 },
  );
}
import { NextResponse } from "next/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import {
  formatDateInSantiago,
  formatTimeInSantiago,
  getSantiagoDayBounds,
} from "@/lib/datetime/santiago";
import { getTypedSearchParams } from "@/lib/search-params";
import { supabaseServer } from "@/lib/supabase/server";
import { panelBookingsQuerySchema } from "@/validations/panel-bookings-query.schema";

type BookingRow = {
  id: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  barber_id: string;
  service_id: string;
  start_at: string;
  end_at: string;
  barbers: Array<{ name: string }> | null;
  services: Array<{ name: string }> | null;
};

export async function GET(req: Request): Promise<Response> {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!panelUser.ok) {
    return NextResponse.json(
      { error: panelUser.error },
      { status: panelUser.status },
    );
  }

 

  const parsedQuery = panelBookingsQuerySchema.safeParse(getTypedSearchParams(req));

  if (!parsedQuery.success) {
    const message = parsedQuery.error.issues[0]?.message ?? "Parámetros inválidos";
    return NextResponse.json(
      { error: message, code: "INVALID_PANEL_BOOKINGS_QUERY" },
      { status: 400 },
    );
  }

  const { dateFrom, dateTo, barberId, status, q, page, pageSize } = parsedQuery.data;
  const scopedBarberId = panelUser.role === "barber"
    ? panelUser.barberId
    : barberId && barberId !== "all"
      ? barberId
      : null;

const dateFromBound = dateFrom ? getSantiagoDayBounds(dateFrom).startAtIso : null;
  const dateToBound = dateTo ? getSantiagoDayBounds(dateTo).endAtIso : null;

  let query = supabase
    .from("appointments")
    .select(
      "id, status, customer_name, customer_phone, barber_id, service_id, start_at, end_at, barbers(name), services(name)",
      { count: "exact" },
    )
    .order("start_at", { ascending: true });

  if (scopedBarberId) {
    query = query.eq("barber_id", scopedBarberId);
  }

  if (dateFromBound) {
    query = query.gte("start_at", dateFromBound);
  }

  if (dateToBound) {
    query = query.lte("start_at", dateToBound);
  }

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (q) {
    query = query.or(`customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query.range(from, to);

  if (error) {
    return NextResponse.json(
      { error: error.message, code: "PANEL_BOOKINGS_QUERY_ERROR" },
      { status: 400 },
    );
  }

  const bookings = (data ?? []) as BookingRow[];

  return NextResponse.json(
    {
      ok: true,
      page,
      pageSize,
      total: count ?? 0,
      items: bookings.map((item) => ({
        id: item.id,
        date: formatDateInSantiago(item.start_at),
        time: formatTimeInSantiago(item.start_at),
        start_at: item.start_at,
        end_at: item.end_at,
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
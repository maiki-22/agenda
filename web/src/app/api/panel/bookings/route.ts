import { NextResponse } from "next/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { getTypedSearchParams } from "@/lib/search-params";
import { supabaseServer } from "@/lib/supabase/server";
import { panelBookingsQuerySchema } from "@/validations/panel-bookings-query.schema";

type SearchBookingsRow = {
  id: string;
  date: string;
  time: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  barber_id: string;
  service_id: string;
  barber_name: string | null;
  service_name: string | null;
  total_count: number;
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

  const { data, error } = await supabase.rpc("search_bookings", {
    p_barber_id: scopedBarberId,
    p_date_from: dateFrom ?? null,
    p_date_to: dateTo ?? null,
    p_page: page,
    p_page_size: pageSize,
    p_query: q || null,
    p_status: status === "all" ? null : status,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message, code: "PANEL_BOOKINGS_QUERY_ERROR" },
      { status: 400 },
    );
  }

const bookings = (data ?? []) as SearchBookingsRow[];

  return NextResponse.json(
    {
      ok: true,
      page,
      pageSize,
      total: bookings[0]?.total_count ?? 0,
      items: bookings.map((item) => ({
        id: item.id,
        date: item.date,
        time: item.time,
        status: item.status,
        customer_name: item.customer_name,
        customer_phone: item.customer_phone,
        barber_id: item.barber_id,
        barber_name: item.barber_name ?? item.barber_id,
        service_id: item.service_id,
        service_name: item.service_name ?? item.service_id,
      })),
    },
    { status: 200 },
  );
}
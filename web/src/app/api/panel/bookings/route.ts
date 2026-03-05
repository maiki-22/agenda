import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/isAdmin";

const VALID_STATUS = new Set(["booked", "needs_confirmation", "confirmed", "cancelled"]);

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
  const admin = await getAuthenticatedAdmin(supabase);

  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { searchParams } = new URL(req.url);
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const barberId = searchParams.get("barberId") ?? "";
  const status = searchParams.get("status") ?? "";
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(Number(searchParams.get("page") ?? "1") || 1, 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") ?? "10") || 10, 1), 50);

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
  if (barberId && barberId !== "all") query = query.eq("barber_id", barberId);
  if (status && status !== "all" && VALID_STATUS.has(status)) query = query.eq("status", status);

  if (q) {
    const escaped = q.replace(/[%_]/g, "");
    query = query.or(`customer_name.ilike.%${escaped}%,customer_phone.ilike.%${escaped}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
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
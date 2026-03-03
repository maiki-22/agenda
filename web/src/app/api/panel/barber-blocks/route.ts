import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/isAdmin";


export async function GET(req: Request) {
  const supabase = await supabaseServer();
   const admin = await getAuthenticatedAdmin(supabase);

   if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const barberId = searchParams.get("barberId");

  let q = supabase
    .from("barber_blocks")
    .select("id, barber_id, date, start_at, end_at, reason, created_at");

  if (date) q = q.eq("date", date);
  if (barberId) q = q.eq("barber_id", barberId);

  const { data, error } = await q.order("start_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });
  return NextResponse.json({ ok: true, blocks: data ?? [] }, { status: 200 });
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const admin = await getAuthenticatedAdmin(supabase);

if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const body = await req.json().catch(() => ({}));
  const { barber_id, date, start_at, end_at, reason } = body;

  if (!barber_id || !date || !start_at || !end_at) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("barber_blocks")
    .insert({ barber_id, date, start_at, end_at, reason: reason ?? null })
    .select("id, barber_id, date, start_at, end_at, reason")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });
  return NextResponse.json({ ok: true, block: data }, { status: 201 });
}
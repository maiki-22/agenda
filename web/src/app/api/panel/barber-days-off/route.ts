import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/isAdmin";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const admin = await getAuthenticatedAdmin(supabase);

  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const body = await req.json().catch(() => ({}));
  const { barber_id, date, reason } = body;

  if (!barber_id || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("barber_days_off")
    .insert({ barber_id, date, reason: reason ?? null })
    .select("id, barber_id, date, reason")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json({ ok: true, dayOff: data }, { status: 201 });
}
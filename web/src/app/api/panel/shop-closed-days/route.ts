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
  const { date, reason } = body;

  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("shop_closed_days")
    .insert({ date, reason: reason ?? null })
    .select("id, date, reason")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json({ ok: true, closedDay: data }, { status: 201 });
}
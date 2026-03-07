import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";

export async function POST(req: Request) {
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
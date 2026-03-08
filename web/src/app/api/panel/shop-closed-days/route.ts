import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { shopClosedDaySchema } from "@/validations/shop-closed-day.schema";

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
   return NextResponse.json({ error: "No autorizado", code: "FORBIDDEN" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const parsedBody = shopClosedDaySchema.safeParse(body);

   if (!parsedBody.success) {
    const message = parsedBody.error.issues[0]?.message ?? "Body inválido";
    return NextResponse.json(
      { error: message, code: "INVALID_SHOP_CLOSED_DAY_INPUT" },
      { status: 400 },
    );
  }

  const { date, reason } = parsedBody.data;

  const { data, error } = await supabase
    .from("shop_closed_days")
    .insert({ date, reason: reason ?? null })
    .select("id, date, reason")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message, code: "SHOP_CLOSED_DAY_INSERT_ERROR" }, { status: 403 });
  }

  return NextResponse.json({ ok: true, closedDay: data }, { status: 201 });
}
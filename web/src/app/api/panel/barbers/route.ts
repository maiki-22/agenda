import { NextResponse } from "next/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(): Promise<Response> {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!panelUser.ok) {
    return NextResponse.json(
      { error: panelUser.error },
      { status: panelUser.status },
    );
  }

  const { data, error } = await supabase
    .from("barbers")
    .select("id, name, active, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message, code: "PANEL_BARBERS_QUERY_ERROR" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      barbers: (data ?? []).map((barber) => ({
        id: barber.id,
        name: barber.name,
        active: barber.active,
      })),
    },
    { status: 200 },
  );
}
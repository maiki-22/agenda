import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { BarberIdSchema } from "@/validations/barber-id.schema";
import {
  getAuthenticatedPanelUser,
  isAuthenticatedPanelUser,
} from "@/lib/auth/get-authenticated-panel-user";

const createBarberBlockSchema = z.object({
  barber_id: BarberIdSchema,
  date: z.string().min(1),
  start_at: z.string().min(1),
  end_at: z.string().min(1),
  reason: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!isAuthenticatedPanelUser(panelUser)) {
    return NextResponse.json(
      { error: panelUser.error },
      { status: panelUser.status },
    );
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const barberId = searchParams.get("barberId");

  let q = supabase
    .from("barber_blocks")
    .select("id, barber_id, date, start_at, end_at, reason, created_at");

  if (date) q = q.eq("date", date);
  if (panelUser.role === "barber") {
    q = q.eq("barber_id", panelUser.barberId);
  } else if (barberId) {
    q = q.eq("barber_id", barberId);
  }

  const { data, error } = await q.order("start_at", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 403 });
  return NextResponse.json({ ok: true, items: data ?? [] }, { status: 200 });
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!isAuthenticatedPanelUser(panelUser)) {
    return NextResponse.json(
      { error: panelUser.error },
      { status: panelUser.status },
    );
  }

  const parsedBody = createBarberBlockSchema.safeParse(
    await req.json().catch(() => ({})),
  );

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  if (
    panelUser.role === "barber" &&
    parsedBody.data.barber_id !== panelUser.barberId
  ) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("barber_blocks")
    .insert({
      barber_id: parsedBody.data.barber_id,
      date: parsedBody.data.date,
      start_at: parsedBody.data.start_at,
      end_at: parsedBody.data.end_at,
      reason: parsedBody.data.reason ?? null,
    })
    .select("id, barber_id, date, start_at, end_at, reason")
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 403 });
  return NextResponse.json({ ok: true, block: data }, { status: 201 });
}
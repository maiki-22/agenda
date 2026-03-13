import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { z } from "zod";
import { BarberIdSchema } from "@/validations/barber-id.schema";
import {
  getAuthenticatedPanelUser,
  isAuthenticatedPanelUser,
} from "@/lib/auth/get-authenticated-panel-user";

const createBarberDayOffSchema = z.object({
  barber_id: BarberIdSchema,
  date: z.string().min(1),
  reason: z.string().optional().nullable(),
});

const deleteBarberDayOffSchema = z.object({
  id: z.string().min(1),
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
  const barberId = searchParams.get("barberId");

  let query = supabase
    .from("barber_days_off")
    .select("id, barber_id, date, reason")
    .order("date", { ascending: true });

  if (panelUser.role === "barber") {
    query = query.eq("barber_id", panelUser.barberId);
  } else if (barberId) {
    query = query.eq("barber_id", barberId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

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

  const parsedBody = createBarberDayOffSchema.safeParse(
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
    .from("barber_days_off")
    .insert({
      barber_id: parsedBody.data.barber_id,
      date: parsedBody.data.date,
      reason: parsedBody.data.reason ?? null,
    })
    .select("id, barber_id, date, reason")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json({ ok: true, dayOff: data }, { status: 201 });
}

export async function DELETE(req: Request) {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!isAuthenticatedPanelUser(panelUser)) {
    return NextResponse.json(
      { error: panelUser.error },
      { status: panelUser.status },
    );
  }

  const { searchParams } = new URL(req.url);
  const parsedParams = deleteBarberDayOffSchema.safeParse({
    id: searchParams.get("id"),
  });

  if (!parsedParams.success) {
    return NextResponse.json({ error: "Id inválido" }, { status: 400 });
  }

  let deleteQuery = supabase
    .from("barber_days_off")
    .delete()
    .eq("id", parsedParams.data.id);

  if (panelUser.role === "barber") {
    deleteQuery = deleteQuery.eq("barber_id", panelUser.barberId);
  }

  const { error } = await deleteQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
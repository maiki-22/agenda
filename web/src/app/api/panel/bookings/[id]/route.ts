import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";

const UpdateBookingSchema = z.object({
  status: z.enum(["booked", "needs_confirmation", "confirmed", "cancelled"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!panelUser.ok) {
    return NextResponse.json(
      { error: panelUser.error },
      { status: panelUser.status },
    );
  }


  const { id } = await params;
  const parsed = UpdateBookingSchema.safeParse(
    await req.json().catch(() => ({})),
  );

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("barber_id")
    .eq("id", id)
    .maybeSingle<{ barber_id: string }>();

  if (appointmentError || !appointment) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  if (
    panelUser.role === "barber" &&
    appointment.barber_id !== panelUser.barberId
  ) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { error } = await supabase
    .from("appointments")
    .update({ status: parsed.data.status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
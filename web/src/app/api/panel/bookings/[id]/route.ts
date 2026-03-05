import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/isAdmin";

const UpdateBookingSchema = z.object({
  status: z.enum(["booked", "needs_confirmation", "confirmed", "cancelled"]),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await supabaseServer();
  const admin = await getAuthenticatedAdmin(supabase);

  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { id } = await params;
  const parsed = UpdateBookingSchema.safeParse(await req.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase.from("appointments").update({ status: parsed.data.status }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
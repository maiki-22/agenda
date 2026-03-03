import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/isAdmin";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await supabaseServer();
  const admin = await getAuthenticatedAdmin(supabase);

  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "Missing active boolean" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("barbers")
    .update({ active: body.active, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, name, active")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json({ ok: true, barber: data }, { status: 200 });
}
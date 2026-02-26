import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email/password" },
      { status: 400 },
    );
  }

  const supabase = await supabaseServer();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });

  return NextResponse.json({ ok: true }, { status: 200 });
}

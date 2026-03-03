import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/isAdmin";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminPanelPage() {
  const supabase = await supabaseServer();
  const admin = await getAuthenticatedAdmin(supabase);

  if (!admin.ok) {
    redirect("/");
  }

  return <AdminDashboardClient />;
}
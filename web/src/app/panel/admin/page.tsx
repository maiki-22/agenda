import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { getBookings } from "@/services/panel/bookings";
import { getOverview } from "@/services/panel/overview";
import type { BookingsResponse, OverviewResponse } from "@/types/panel";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminPanelPage() {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!panelUser.ok) {
    redirect("/");
  }

  if (panelUser.role !== "admin") {
    redirect("/");
  }

  const overviewResult = await getOverview({ window: "next_7_days" });
  const initialOverview: OverviewResponse | null = overviewResult.success
    ? overviewResult.data
    : null;

  const bookingsResult = initialOverview
    ? await getBookings({
        dateFrom: initialOverview.date_window.startDate,
        dateTo: initialOverview.date_window.endDate,
        status: "all",
        query: "",
      })
    : null;

  const initialBookings: BookingsResponse | null =
    bookingsResult && bookingsResult.success ? bookingsResult.data : null;

  return (
    <AdminDashboardClient
      initialOverview={initialOverview}
      initialBookings={initialBookings}
      role="admin"
    />
  );
}

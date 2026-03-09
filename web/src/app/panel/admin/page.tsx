import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { getBookings } from "@/services/panel/bookings";
import { getOverview } from "@/services/panel/overview";
import type { BookingsResponse, OverviewResponse } from "@/types/panel";
import { AdminDashboardClient } from "./AdminDashboardClient";


function getCurrentWeekDateRange(): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(now.getDate() + mondayOffset);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const dateFrom = start.toISOString().slice(0, 10);
  const dateTo = end.toISOString().slice(0, 10);

  return { dateFrom, dateTo };
}




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

  const { dateFrom, dateTo } = getCurrentWeekDateRange();
  const bookingsResult = await getBookings({
    dateFrom,
    dateTo,
    status: "all",
    query: "",
  });

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

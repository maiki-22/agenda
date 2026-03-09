import { redirect } from "next/navigation";
import { z } from "zod";
import { getAuthenticatedPanelUser } from "@/lib/auth/get-authenticated-panel-user";
import { supabaseServer } from "@/lib/supabase/server";
import { getBookings } from "@/services/panel/bookings";
import { getBarberBlocks, getBarberDaysOff } from "@/services/panel/scheduling";
import type {
  BarberBlocksResponse,
  BarberDaysOffResponse,
  BookingsResponse,
} from "@/types/panel";
import { BarberIdSchema } from "@/validations/barber-id.schema";
import { BarberDashboardClient } from "./BarberDashboardClient";

const searchSchema = z.object({
  barberId: BarberIdSchema.optional(),
});

function getDateRange(): { dateFrom: string; dateTo: string } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 30);

  const dateFrom = start.toISOString().slice(0, 10);
  const dateTo = end.toISOString().slice(0, 10);

  return { dateFrom, dateTo };
}

interface BarberPanelPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BarberPanelPage({
  searchParams,
}: BarberPanelPageProps) {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!panelUser.ok) {
    redirect("/");
  }

  const parsedSearch = searchSchema.safeParse(await searchParams);
  const requestedBarberId =
    parsedSearch.success && typeof parsedSearch.data.barberId === "string"
      ? parsedSearch.data.barberId
      : undefined;

  const barberId =
    panelUser.role === "barber" ? panelUser.barberId : requestedBarberId;

  if (!barberId) {
    redirect("/panel/admin");
  }

  const { dateFrom, dateTo } = getDateRange();

  const bookingsResult = await getBookings({
    dateFrom,
    dateTo,
    barberId,
    status: "all",
    query: "",
  });
  const blocksResult = await getBarberBlocks({ barberId });
  const daysOffResult = await getBarberDaysOff({ barberId });

  const initialBookings: BookingsResponse | null = bookingsResult.success
    ? bookingsResult.data
    : null;
  const initialBlocks: BarberBlocksResponse | null = blocksResult.success
    ? blocksResult.data
    : null;
  const initialDaysOff: BarberDaysOffResponse | null = daysOffResult.success
    ? daysOffResult.data
    : null;

  return (
    <BarberDashboardClient
      barberId={barberId}
      dateFrom={dateFrom}
      dateTo={dateTo}
      initialBookings={initialBookings}
      initialBlocks={initialBlocks}
      initialDaysOff={initialDaysOff}
      role="barber"
    />
  );
}

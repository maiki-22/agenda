import { redirect } from "next/navigation";
import { BookingConfirmationSearchParamsSchema } from "@/validations/booking-confirmation.schema";
import ConfirmacionClient from "./ConfirmacionClient";

type SearchParams = {
  token?: string;
};

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const parsed = BookingConfirmationSearchParamsSchema.safeParse(params);

  if (!parsed.success) {
    redirect("/reservar");
  }

  return (
    <main>
      <ConfirmacionClient token={parsed.data.token} />
    </main>
  );
}
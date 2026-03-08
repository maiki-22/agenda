import { redirect } from "next/navigation";
import { normalizeSearchParamObject } from "@/lib/search-params";
import { bookingConfirmationEndpointSchema } from "@/validations/booking-confirmation-endpoint.schema";
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
    const parsed = bookingConfirmationEndpointSchema.safeParse(
      normalizeSearchParamObject(params),
    );

  if (!parsed.success || !parsed.data.token) {
    redirect("/reservar");
  }

  return (
    <main>
      <ConfirmacionClient token={parsed.data.token} />
    </main>
  );
}
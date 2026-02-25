import { redirect } from "next/navigation";
import ConfirmacionClient from "./ConfirmacionClient";

type SearchParams = { bookingId?: string };

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { bookingId } = await searchParams;

  if (!bookingId) redirect("/reservar");

  return (
    <main>
      <ConfirmacionClient bookingId={bookingId} />
    </main>
  );
}
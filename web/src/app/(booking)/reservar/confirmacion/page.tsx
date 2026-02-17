import { redirect } from "next/navigation";
import ConfirmacionClient from "./ConfirmacionClient";

type SearchParams = { bookingId?: string };

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams;
}) {
  const sp = await Promise.resolve(searchParams);
  const bookingId = sp.bookingId;

  if (!bookingId) {
    redirect("/reservar");
  }

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-8 space-y-4">
      <h1 className="text-2xl font-bold">Reserva confirmada</h1>
      <ConfirmacionClient bookingId={bookingId} />
    </main>
  );
}
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
    <main className="mx-auto max-w-md p-0">
      <ConfirmacionClient bookingId={bookingId} />
    </main>
  );
}

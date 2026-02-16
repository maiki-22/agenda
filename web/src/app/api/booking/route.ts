import { NextResponse } from "next/server";
import { createBookingService } from "@/features/booking/services/createBooking";
import { getBookingById } from "@/features/booking/data/booking.repo";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const booking = getBookingById(id);
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ booking }, { status: 200 });
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const booking = createBookingService(body);
    return NextResponse.json({ bookingId: booking.id, booking }, { status: 201 });
  } catch (e: any) {
    const code = e?.code;
    const status = code === "SLOT_TAKEN" ? 409 : 400;
    return NextResponse.json(
      { error: e?.message ?? "Bad Request", code: code ?? "BAD_REQUEST" },
      { status }
    );
  }
}
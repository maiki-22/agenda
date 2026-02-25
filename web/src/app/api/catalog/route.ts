import { NextResponse } from "next/server";
import { listBarbers, listServices } from "@/features/booking/data/catalog.repo";

export async function GET() {
  const [services, barbers] = await Promise.all([listServices(), listBarbers()]);
  return NextResponse.json({ services, barbers });
}
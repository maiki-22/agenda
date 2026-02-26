import { NextResponse } from "next/server";
import { BookingDraftSchema } from "@/features/booking/domain/booking.schema";
import { listServices } from "@/features/booking/data/catalog.repo";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select(
      `
      id,
      barber_id,
      service_id,
      date,
      time,
      duration_min,
      customer_name,
      customer_phone,
      status,
      created_at,
      barbers ( name ),
      services ( name, price_clp )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const booking = {
    id: data.id,
    barberId: data.barber_id,
    service: data.service_id,
    date: data.date,
    time: data.time,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    durationMinutes: data.duration_min,
    createdAt: data.created_at,
    status: data.status,

    barberName: (data as any).barbers?.name ?? data.barber_id,
    serviceName: (data as any).services?.name ?? data.service_id,
    servicePriceClp: (data as any).services?.price_clp ?? null,
  };

  return NextResponse.json({ booking }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const draft = BookingDraftSchema.parse(body);

    const services = await listServices();
    const svc = services.find((s) => s.id === draft.service);
    if (!svc) {
      return NextResponse.json(
        { error: "Servicio inválido", code: "INVALID_SERVICE" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin.rpc("create_booking", {
      p_barber_id: draft.barberId,
      p_service_id: draft.service,
      p_date: draft.date,
      p_time: draft.time,
      p_duration_min: svc.duration_min,
      p_customer_name: draft.customerName,
      p_customer_phone: draft.customerPhone,
    });

    if (error) {
      if (
        (error as any).code === "P0001" &&
        String(error.message).includes("MIN_LEAD_TIME")
      ) {
        return NextResponse.json(
          {
            error: "Debes reservar con al menos 30 minutos de anticipación",
            code: "MIN_LEAD_TIME",
          },
          { status: 400 },
        );
      }

      if ((error as any).code === "23P01") {
        return NextResponse.json(
          { error: "Horario no disponible", code: "SLOT_TAKEN" },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: error.message, code: (error as any).code ?? "DB_ERROR" },
        { status: 400 },
      );
    }

    return NextResponse.json({ bookingId: data }, { status: 201 });
  } catch (e: unknown) {
    const err = e instanceof Error ? e : new Error("Bad Request");
    return NextResponse.json(
      { error: err.message, code: "BAD_REQUEST" },
      { status: 400 },
    );
  }
}
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Booking } from "@/features/booking/domain/booking.types";
import { BookingSummary } from "@/features/booking/ui/BookingSummary";

export default function ConfirmacionPage() {
  const router = useRouter();
  const params = useSearchParams();
  const bookingId = params.get("bookingId") ?? "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      router.replace("/reservar");
      return;
    }

    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/booking?id=${encodeURIComponent(bookingId)}`);
        if (res.status === 404) {
          router.replace("/reservar");
          return;
        }
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "Error cargando reserva");

        if (alive) setBooking(json.booking as Booking);
      } catch {
        // si falla el fetch por cualquier razón, vuelve al flujo
        router.replace("/reservar");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [bookingId, router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-4 sm:p-8">
        <p className="text-sm text-gray-500">Cargando confirmación...</p>
      </main>
    );
  }

  if (!booking) return null;

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-8 space-y-4">
      <h1 className="text-2xl font-bold">Reserva confirmada</h1>

      <div className="text-sm text-gray-600">
        ID de reserva: <span className="font-mono">{booking.id}</span>
      </div>

      <BookingSummary
        barberId={booking.barberId}
        service={booking.service}
        date={booking.date}
        time={booking.time}
        customerName={booking.customerName}
        customerPhone={booking.customerPhone}
      />

      <div className="rounded-2xl border border-gray-200 p-4 text-sm text-gray-700">
        Te llegará una confirmación por WhatsApp con los datos de tu cita.
      </div>
    </main>
  );
}
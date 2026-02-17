"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Booking } from "@/features/booking/domain/booking.types";
import { BookingSummary } from "@/features/booking/ui/BookingSummary";

export default function ConfirmacionClient({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/booking?id=${encodeURIComponent(bookingId)}`, {
          cache: "no-store",
        });

        if (res.status === 404) {
          router.replace("/reservar");
          return;
        }

        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "Error cargando reserva");

        if (alive) setBooking(json.booking as Booking);
      } catch {
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

  if (loading) return <p className="text-sm text-gray-500">Cargando confirmación...</p>;
  if (!booking) return null;

  return (
    <div className="space-y-4">
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
    </div>
  );
}
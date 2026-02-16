"use client";

import { BARBERS, SERVICES } from "../domain/booking.logic";
import type { ServiceType } from "../domain/booking.types";

export function BookingSummary({
  barberId,
  service,
  date,
  time,
  customerName,
  customerPhone,
}: {
  barberId: string;
  service: ServiceType | "";
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
}) {
  const barber = BARBERS.find((b) => b.id === barberId);
  const svc = SERVICES.find((s) => s.id === service);

  return (
    <div className="rounded-2xl border border-gray-200 p-4 space-y-2">
      <div className="text-lg font-semibold">Resumen</div>
      <div className="text-sm text-gray-700">
        <div><span className="font-medium">Barbero:</span> {barber?.name ?? "-"}</div>
        <div><span className="font-medium">Servicio:</span> {svc?.label ?? "-"}</div>
        <div><span className="font-medium">Fecha:</span> {date || "-"}</div>
        <div><span className="font-medium">Hora:</span> {time || "-"}</div>
        <div><span className="font-medium">Cliente:</span> {customerName || "-"}</div>
        <div><span className="font-medium">Teléfono:</span> {customerPhone || "-"}</div>
      </div>
    </div>
  );
}
"use client";

import { z } from "zod";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/features/booking/store/booking.store";
import { Stepper } from "@/features/booking/ui/Stepper";
import { BarberSelector } from "@/features/booking/ui/BarberSelector";
import { ServiceSelector } from "@/features/booking/ui/ServiceSelector";
import { DateSelector } from "@/features/booking/ui/DateSelector";
import { TimeSelector } from "@/features/booking/ui/TimeSelector";
import { CustomerForm } from "@/features/booking/ui/CustomerForm";
import { BookingSummary } from "@/features/booking/ui/BookingSummary";
import { BookingDraftSchema } from "@/features/booking/domain/booking.schema";

export default function ReservarPage() {
  const router = useRouter();
  const s = useBookingStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const phoneLooksValid = s.customerPhone.replace(/[^\d]/g, "").length >= 8;

  const canNext = useMemo(() => {
    if (step === 1) return !!s.barberId;
    if (step === 2) return !!s.service;
    if (step === 3) return !!s.date;
    if (step === 4) return !!s.time;
    if (step === 5) return !!s.customerName && phoneLooksValid;
    return true;
  }, [step, s, phoneLooksValid]);

  async function onConfirm() {
    setError("");
   try {
      const draft = BookingDraftSchema.parse({
        barberId: s.barberId,
        service: s.service,
        date: s.date,
        time: s.time,
        customerName: s.customerName,
        customerPhone: s.customerPhone,
      });

      setSubmitting(true);

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const json = await res.json();

      if (!res.ok) {
        // Caso especial: horario tomado
        if (res.status === 409 && json?.code === "SLOT_TAKEN") {
          s.setTime("");
          setRefreshKey((k) => k + 1);
          setError("Ese horario ya no está disponible. Elige otra hora.");
          setStep(4); // vuelve al paso de hora
          return;
        }
        throw new Error(json?.error ?? "No se pudo crear la reserva");
      }

    router.push(
      `/reservar/confirmacion?bookingId=${encodeURIComponent(json.bookingId)}`
    );

    // Limpia wizard después de iniciar navegación
    setTimeout(() => s.reset(), 0);
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      const first = e.issues[0]?.message ?? "Datos inválidos";
      setError(first);

      const hasPhone = e.issues.some((issue) => issue.path?.[0] === "customerPhone");
      if (hasPhone) setStep(5);
    } else if (e instanceof Error) {
      setError(e.message);
    } else {
      setError("Error");
    }
    } finally {
    setSubmitting(false);
  }
}

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Reservar hora</h1>

      <Stepper step={step} />

      {step === 1 && (
        <BarberSelector value={s.barberId} onChange={(id) => s.setBarberId(id)} />
      )}

      {step === 2 && (
        <ServiceSelector
          value={s.service}
          onChange={(svc) => s.setService(svc)}
        />
      )}

      {step === 3 && (
        <DateSelector value={s.date} onChange={(d) => s.setDate(d)} />
      )}

      {step === 4 && (
        <TimeSelector
          barberId={s.barberId}
          date={s.date}
          service={s.service}
          value={s.time}
          onChange={(t) => s.setTime(t)}
          refreshKey={refreshKey}
          />
      )}

      {step === 5 && (
        <CustomerForm
          name={s.customerName}
          phone={s.customerPhone}
          onChange={(name, phone) => {
          setError("");          
          s.setCustomer(name, phone);
          }}
        />
      )}

      {step === 6 && (
        <div className="space-y-4">
          <BookingSummary
            barberId={s.barberId}
            service={s.service}
            date={s.date}
            time={s.time}
            customerName={s.customerName}
            customerPhone={s.customerPhone}
          />

          <p className="text-sm text-gray-600">
            Al confirmar, recibirás la confirmación por WhatsApp.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

  <div className="flex items-center justify-between pt-2">
    <button
      className="rounded-xl border border-gray-200 px-4 py-2 disabled:opacity-50"
      onClick={() => setStep((v) => Math.max(1, v - 1))}
      disabled={step === 1 || submitting}
    >
      Atrás
    </button>

    {step < 6 ? (
      <button
        className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
        onClick={() => canNext && setStep((v) => Math.min(6, v + 1))}
        disabled={!canNext || submitting}
      >
        Siguiente
      </button>
    ) : (
      <button
        className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
        onClick={onConfirm}
        disabled={submitting}
      >
        {submitting ? "Confirmando..." : "Confirmar reserva"}
      </button>
  )}
  </div>
    </main>
  );
}
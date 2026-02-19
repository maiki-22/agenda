"use client";

import { z } from "zod";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/features/booking/store/booking.store";
import { Stepper } from "@/features/booking/ui/Stepper";
import { BarberSelector } from "@/features/booking/ui/BarberSelector";
import { ServiceSelector } from "@/features/booking/ui/ServiceSelector";
import { TimeSelector } from "@/features/booking/ui/TimeSelector";
import { CustomerForm } from "@/features/booking/ui/CustomerForm";
import { BookingDraftSchema } from "@/features/booking/domain/booking.schema";
import { DateScroller } from "@/features/booking/ui/DateScroller";
import BookingHeader from "@/components/booking/BookingHeader";
import { SERVICES, BARBERS } from "@/features/booking/domain/booking.logic";

export default function ReservarPage() {
  const router = useRouter();
  const s = useBookingStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const isChileMobileE164 = (v: string) => /^\+569\d{8}$/.test(v);
  const [phoneShakeKey, setPhoneShakeKey] = useState(0);

  const canNext = useMemo(() => {
    if (step === 1) return !!s.barberId;
    if (step === 2) return !!s.service;
    if (step === 3) return !!s.date;
    if (step === 4) return !!s.time;
    if (step === 5)
      return (
        s.customerName.trim().length > 0 && isChileMobileE164(s.customerPhone)
      );
    return true;
  }, [step, s, isChileMobileE164]);

  const stepTitle =
    step === 1
      ? "Selecciona barbero"
      : step === 2
        ? "Selecciona servicio"
        : step === 3
          ? "Selecciona día"
          : step === 4
            ? "Selecciona hora"
            : step === 5
              ? "Tus datos"
              : "Confirmar reserva";

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
        `/reservar/confirmacion?bookingId=${encodeURIComponent(json.bookingId)}`,
      );

      // Limpia wizard después de iniciar navegación
      setTimeout(() => s.reset(), 0);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        const first = e.issues[0]?.message ?? "Datos inválidos";
        setError(first);

        const hasPhone = e.issues.some(
          (issue) => issue.path?.[0] === "customerPhone",
        );
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
    <div className="min-h-dvh">
      <BookingHeader title={stepTitle} subtitle="Reserva" showBack={false} />

      <main className="mx-auto max-w-md md:max-w-2xl lg:max-w-3xl p-4 sm:p-6 space-y-6 pb-28">
        <h1 className="text-2xl font-bold">Reservar hora</h1>

        <Stepper
          step={step}
          onJump={(target) => {
            // Permite saltar solo hacia atrás (pro: evita inconsistencias)
            if (target <= step && !submitting) setStep(target);
          }}
        />

        {step === 1 && (
          <BarberSelector
            value={s.barberId}
            onChange={(id) => s.setBarberId(id)}
          />
        )}

        {step === 2 && (
          <ServiceSelector
            value={s.service}
            onChange={(svc) => s.setService(svc)}
          />
        )}

        {step === 3 && (
          <DateScroller
            value={s.date}
            onChange={(d) => {
              setError("");
              s.setDate(d);
            }}
            daysAhead={7}
          />
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
            shakeKey={phoneShakeKey}
            onChange={(name, phone) => {
              setError("");
              s.setCustomer(name, phone);
            }}
          />
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4">
              <div className="text-sm font-semibold">Resumen</div>

              <div className="mt-3 space-y-2 text-sm">
                <Row label="Barbero" value={barberNameFromId(s.barberId)} />
                <Row label="Servicio" value={serviceLabelFromId(s.service)} />
                <Row label="Fecha" value={s.date} />
                <Row label="Hora" value={s.time} />
                <div className="my-3 border-t border-[rgb(var(--border))]" />
                <Row label="Cliente" value={s.customerName} />
                <Row label="Teléfono" value={s.customerPhone} />
              </div>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 text-sm text-[rgb(var(--muted))]">
              Al confirmar, recibirás la confirmación por WhatsApp.
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </main>

      {/* Bottom bar fijo (SIEMPRE visible) */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur">
         <div className="mx-auto max-w-md px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] flex items-center justify-between gap-3"
>
          <button
            className="w-28 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm disabled:opacity-50"
            onClick={() => setStep((v) => Math.max(1, v - 1))}
            disabled={step === 1 || submitting}
          >
            Atrás
          </button>

          {step < 6 ? (
            <button
              className="flex-1 rounded-2xl bg-[rgb(var(--primary))] px-4 py-3 text-sm font-semibold text-[rgb(var(--primary-foreground))] disabled:opacity-50"
              onClick={() => {
                if (!canNext) {
                  if (step === 5) setPhoneShakeKey((k) => k + 1);
                  return;
                }
                setStep((v) => Math.min(6, v + 1));
              }}
              disabled={!canNext || submitting}
            >
              Siguiente
            </button>
          ) : (
            <button
              className="flex-1 rounded-2xl bg-[rgb(var(--primary))] px-4 py-3 text-sm font-semibold text-[rgb(var(--primary-foreground))] disabled:opacity-50"
              onClick={onConfirm}
              disabled={submitting}
            >
              {submitting ? "Confirmando..." : "Confirmar reserva"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-[rgb(var(--muted))]">{label}</div>
      <div className={mono ? "font-mono" : "font-medium"}>{value}</div>
    </div>
  );
}

function barberNameFromId(id: string) {
  return BARBERS.find((b) => b.id === id)?.name ?? id;
}

function serviceLabelFromId(id: string) {
  return SERVICES.find((s) => s.id === id)?.label ?? id;
}

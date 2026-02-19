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
import MessageReportIcon from "@/components/icons/MessageReportIcon";

const TOTAL_STEPS = 6;

export default function ReservarPage() {
  const router = useRouter();
  const s = useBookingStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [phoneShakeKey, setPhoneShakeKey] = useState(0);

  const isChileMobileE164 = (v: string) => /^\+569\d{8}$/.test(v);

  const canNext = useMemo(() => {
    if (step === 1) return !!s.barberId;
    if (step === 2) return !!s.service;
    if (step === 3) return !!s.date;
    if (step === 4) return !!s.time;
    if (step === 5)
      return s.customerName.trim().length > 0 && isChileMobileE164(s.customerPhone);
    return true;
  }, [step, s]);

  const stepTitle =
    step === 1 ? "Selecciona barbero"
    : step === 2 ? "Selecciona servicio"
    : step === 3 ? "Selecciona día"
    : step === 4 ? "Selecciona hora"
    : step === 5 ? "Tus datos"
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
        if (res.status === 409 && json?.code === "SLOT_TAKEN") {
          s.setTime("");
          setRefreshKey((k) => k + 1);
          setError("Ese horario ya no está disponible. Elige otra hora.");
          setStep(4);
          return;
        }
        throw new Error(json?.error ?? "No se pudo crear la reserva");
      }

      router.push(`/reservar/confirmacion?bookingId=${encodeURIComponent(json.bookingId)}`);
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
    <div className="min-h-dvh">
      <BookingHeader showBack={false} />

      <main className="page-container py-4 sm:py-6 space-y-6 pb-32">

        {/* ── Encabezado centrado ── */}
        <div className="text-center space-y-1">
          <p className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
            Agenda tu cita
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold">Reservar hora</h1>
        </div>

        {/* ── Progress bar enterprise ── */}
        <div className="space-y-3">
          {/* Barra de progreso numérica */}
          <div className="flex items-center justify-between text-xs text-[rgb(var(--muted))]">
            <span>Paso {step} de {TOTAL_STEPS}</span>
            <span className="font-medium text-[rgb(var(--primary))]">
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-[rgb(var(--border))] overflow-hidden">
            <div
              className="h-full rounded-full bg-[rgb(var(--primary))] transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          {/* Pills del stepper */}
          <Stepper
            step={step}
            onJump={(target) => {
              if (target <= step && !submitting) setStep(target);
            }}
          />
        </div>

        {/* ── Contenido del paso ── */}
        {step === 1 && (
          <BarberSelector value={s.barberId} onChange={(id) => s.setBarberId(id)} />
        )}
        {step === 2 && (
          <ServiceSelector value={s.service} onChange={(svc) => s.setService(svc)} />
        )}
        {step === 3 && (
          <DateScroller
            value={s.date}
            onChange={(d) => { setError(""); s.setDate(d); }}
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
            onChange={(name, phone) => { setError(""); s.setCustomer(name, phone); }}
          />
        )}
        {step === 6 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] divide-y divide-[rgb(var(--border))]">
              <div className="px-4 py-3">
                <p className="text-xs font-semibold tracking-widest text-[rgb(var(--muted))] uppercase mb-3">
                  Resumen de tu cita
                </p>
                <div className="space-y-2 text-sm">
                  <Row label="Barbero"  value={barberNameFromId(s.barberId)} />
                  <Row label="Servicio" value={serviceLabelFromId(s.service)} />
                  <Row label="Fecha"    value={s.date} />
                  <Row label="Hora"     value={s.time} />
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-semibold tracking-widest text-[rgb(var(--muted))] uppercase mb-3">
                  Cliente
                </p>
                <div className="space-y-2 text-sm">
                  <Row label="Nombre"   value={s.customerName} />
                  <Row label="Teléfono" value={s.customerPhone} />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm text-[rgb(var(--muted))] flex items-center gap-4">
              <span className="mt-0.5 text-[rgb(var(--primary))] shrink-0"> <MessageReportIcon size={30}/> </span>
              Recibirás el resumen y un recordatorio de tu cita vía WhatsApp.
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-start gap-2" role="alert">
            <span className="shrink-0 mt-0.5">⚠</span>
            {error}
          </div>
        )}
      </main>

      {/* ── Bottom bar fijo ── */}
      <div className="footer-fixed">
        <div className="page-container pt-3 flex items-center gap-3">
          <button
            className="
              w-28 shrink-0 rounded-2xl border border-[rgb(var(--border))]
              bg-[rgb(var(--surface))] px-4 py-3 text-sm font-medium
              disabled:opacity-40 active:scale-[0.98] touch-manipulation min-h-[48px]
              transition-all duration-150
            "
            onClick={() => setStep((v) => Math.max(1, v - 1))}
            disabled={step === 1 || submitting}
          >
            Atrás
          </button>

          {step < 6 ? (
            <button
              className="
                flex-1 rounded-2xl bg-[rgb(var(--primary))] px-4 py-3
                text-sm font-semibold text-[rgb(var(--primary-foreground))]
                disabled:opacity-40 active:scale-[0.98] touch-manipulation min-h-[48px]
                transition-all duration-150
                shadow-[0_4px_24px_rgb(var(--primary)/0.35)]
              "
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
              className="
                flex-1 rounded-2xl bg-[rgb(var(--primary))] px-4 py-3
                text-sm font-semibold text-[rgb(var(--primary-foreground))]
                disabled:opacity-40 active:scale-[0.98] touch-manipulation min-h-[48px]
                transition-all duration-150
                shadow-[0_4px_24px_rgb(var(--primary)/0.35)]
              "
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

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-[rgb(var(--muted))]">{label}</div>
      <div className={mono ? "font-mono text-xs" : "font-medium"}>{value}</div>
    </div>
  );
}

function barberNameFromId(id: string) {
  return BARBERS.find((b) => b.id === id)?.name ?? id;
}

function serviceLabelFromId(id: string) {
  return SERVICES.find((s) => s.id === id)?.label ?? id;
}
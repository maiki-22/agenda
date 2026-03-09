"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { useConfirmacion } from "@/hooks/booking/use-confirmacion";

import CheckIcon from "@/components/icons/CheckIcon";
import { SHOP_LOCATION } from "@/features/booking/config/location";

export default function ConfirmacionClient({ token }: { token: string }) {
  const router = useRouter();
  const errorCardRef = useRef<HTMLDivElement | null>(null);

  const { booking, isLoading, isError, error, refetch } = useConfirmacion(token);

  useEffect(() => {
    if (!isError) {
      return;
    }

    errorCardRef.current?.focus();
  }, [isError]);

  const barberName = booking?.barberName ?? "Barbero";
  const serviceLabel = booking?.serviceName ?? "Servicio";

  const duration = booking?.durationMinutes ?? 30;

  const dateLong = (() => {
    if (!booking?.date) {
      return "";
    }

    const d = new Date(`${booking.date}T00:00:00`);
    const fmt = new Intl.DateTimeFormat("es-CL", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    const s = fmt.format(d);
    return s.charAt(0).toUpperCase() + s.slice(1);
  })();

  const timeRange = (() => {
    if (!booking?.time) {
      return "";
    }

    const [hh, mm] = booking.time.split(":").map(Number);
    const start = hh * 60 + mm;
    const end = start + duration;
    const fmt = (mins: number) => {
      const h = Math.floor(mins / 60) % 24;
      const m = mins % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };
    return `${fmt(start)} – ${fmt(end)}`;
  })();

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="flex-1 overflow-auto py-6 pb-40 sm:pb-36">
        <div className="page-container space-y-5">
          {isLoading && <LoadingState />}

          {isError && (
            <ErrorState
              errorCode={error?.code ?? "UNKNOWN_ERROR"}
              errorMessage={
                error?.message ??
                "No pudimos confirmar tu reserva en este momento."
              }
              onRetry={(): void => {
                void refetch();
              }}
              onBack={(): void => {
                router.push("/reservar");
              }}
              errorCardRef={errorCardRef}
            />
          )}

          {!isLoading && !isError && (
            <>
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className="h-20 w-20 rounded-full bg-[rgb(var(--primary))] grid place-items-center pop-in"
                  style={{
                    filter:
                      "drop-shadow(0 18px 50px rgb(var(--primary-glow) / 0.35))",
                  }}
                >
                  <CheckIcon size={48} className="text-white" />
                </div>
                <div className="pop-in">
                  <div className="text-2xl sm:text-3xl font-extrabold">
                    ¡Cita agendada!
                  </div>
                  <div className="mt-1 text-sm text-[rgb(var(--muted))] max-w-xs mx-auto">
                    Tu reserva fue confirmada. Te enviaremos los detalles por
                    WhatsApp.
                  </div>
                </div>
              </div>
            </>
          )}

          {!isLoading && !isError && booking && (
            <div
              className={[
                "ticket relative isolate rounded-3xl fade-up",
                "border border-[rgb(var(--border))] bg-[rgb(var(--surface))]",
                "shadow-[0_8px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute inset-0 z-0 rounded-3xl bg-gradient-to-br from-[rgb(var(--primary))]/10 via-transparent to-transparent" />
              <div className="relative z-10">
                <Section icon={<ScissorsIcon />} title="Servicio">
                  <div className="text-lg font-semibold">{serviceLabel}</div>
                  <div className="text-sm text-[rgb(var(--muted))]">
                    Con {barberName}
                  </div>
                </Section>

                <Divider />

                <Section icon={<CalendarIcon />} title="Fecha y hora">
                  <div className="text-lg font-semibold">{dateLong}</div>
                  <div className="text-sm text-[rgb(var(--muted))]">
                    {timeRange}
                  </div>
                </Section>

                <Divider />

                <Section icon={<PinIcon />} title="Ubicación">
                  <div className="text-lg font-semibold">
                    {SHOP_LOCATION.name}
                  </div>
                  <div className="text-sm text-[rgb(var(--muted))]">
                    {SHOP_LOCATION.address}
                  </div>
                </Section>

                <Divider />

                <div className="p-4 space-y-2 text-sm">
                  <Row label="Cliente" value={booking.customerName} />
                  <Row label="Teléfono" value={booking.customerPhoneMasked} />
                  <Row label="ID" value={booking.id} mono />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isError && (
        <div className="footer-fixed">
          <div className="page-container pt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="
              rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]
              px-4 py-3 text-sm font-semibold
              hover:brightness-110 active:scale-[0.98] touch-manipulation
              min-h-[48px]
            "
            >
              Ir al inicio
            </button>

            <button
              type="button"
              onClick={() => router.push("/reservar")}
              className="
              rounded-2xl bg-[rgb(var(--primary))]
              px-4 py-3 text-sm font-semibold text-[rgb(var(--primary-foreground))]
              hover:brightness-110 active:scale-[0.98] touch-manipulation
              min-h-[48px]
            "
            >
              Reservar otra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center text-center gap-4" aria-live="polite">
      <div className="h-20 w-20 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] grid place-items-center">
        <div className="h-10 w-10 rounded-full border-4 border-white/10 border-t-[rgb(var(--primary))] animate-spin" />
      </div>
      <div>
        <div className="text-2xl font-bold">Confirmando tu reserva</div>
        <div className="text-sm text-[rgb(var(--muted))] mt-1">
          Un momento… estamos guardando tu cita.
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  errorCode,
  errorMessage,
  onRetry,
  onBack,
  errorCardRef,
}: {
  errorCode: string;
  errorMessage: string;
  onRetry: () => void;
  onBack: () => void;
  errorCardRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={errorCardRef}
      tabIndex={-1}
      role="alert"
      aria-live="assertive"
      className="
        w-full max-w-xl mx-auto rounded-3xl border border-[rgb(var(--border))]
        bg-[rgb(var(--surface))] p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]
      "
    >
      <div className="space-y-2 text-center sm:text-left">
        <p className="text-xs uppercase tracking-widest text-[rgb(var(--muted))]">
          Error de confirmación
        </p>
        <h2 className="text-xl font-bold">No pudimos confirmar tu reserva</h2>
        <p className="text-sm text-[rgb(var(--muted))]">{errorMessage}</p>
        <p className="text-xs text-[rgb(var(--muted))]">Código: {errorCode}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <button
          type="button"
          onClick={onRetry}
          className="
            rounded-2xl bg-[rgb(var(--primary))] px-4 py-3 text-sm font-semibold
            text-[rgb(var(--primary-foreground))] hover:brightness-110
            active:scale-[0.98] min-h-[48px] touch-manipulation
          "
        >
          Reintentar
        </button>
        <button
          type="button"
          onClick={onBack}
          className="
            rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]
            px-4 py-3 text-sm font-semibold hover:brightness-110
            active:scale-[0.98] min-h-[48px] touch-manipulation
          "
        >
          Volver a reservar
        </button>
      </div>
    </div>
  );
}

/* ── Subcomponentes ─────────────────────────────────────────── */

function Divider() {
  return <div className="ticket-divider" />;
}

function Section({
  icon,
  title,
  right,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 flex gap-4">
      <div className="shrink-0 h-12 w-12 rounded-2xl border border-[rgb(var(--border))] bg-black/5 dark:bg-white/5 grid place-items-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
            {title}
          </div>
          {right}
        </div>
        <div className="mt-1">{children}</div>
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
      <div className="shrink-0 text-[rgb(var(--muted))]">{label}</div>
      <div
        className={[
          "min-w-0 text-right truncate",
          mono ? "font-mono text-xs" : "font-medium",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

/* ── Iconos SVG ─────────────────────────────────────────────── */

function ScissorsIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 25"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.25132 3.27236C7.07313 3.01789 6.72238 2.95605 6.46791 3.13424C5.70449 3.66882 5.51897 4.72105 6.05355 5.48448L10.6057 11.9853L8.16317 15.4736L8.16081 15.4769C7.97673 15.4436 7.7871 15.4262 7.5934 15.4262C5.84721 15.4262 4.43164 16.8417 4.43164 18.5879C4.43164 20.3341 5.84721 21.7497 7.5934 21.7497C9.33959 21.7497 10.7552 20.3341 10.7552 18.5879C10.7552 17.8559 10.5064 17.182 10.0888 16.6462L11.9791 13.9467L13.8889 16.6741C13.4844 17.2054 13.2441 17.8686 13.2441 18.5879C13.2441 20.3341 14.6597 21.7497 16.4059 21.7497C18.1521 21.7497 19.5677 20.3341 19.5677 18.5879C19.5677 16.8417 18.1521 15.4262 16.4059 15.4262C16.1994 15.4262 15.9976 15.446 15.8022 15.4837L7.25132 3.27236ZM5.93164 18.5879C5.93164 17.6702 6.67563 16.9262 7.5934 16.9262C8.51116 16.9262 9.25515 17.6702 9.25515 18.5879C9.25515 19.5057 8.51116 20.2497 7.5934 20.2497C6.67563 20.2497 5.93164 19.5057 5.93164 18.5879ZM14.7441 18.5879C14.7441 17.6702 15.4881 16.9262 16.4059 16.9262C17.3237 16.9262 18.0677 17.6702 18.0677 18.5879C18.0677 19.5057 17.3237 20.2497 16.4059 20.2497C15.4881 20.2497 14.7441 19.5057 14.7441 18.5879Z" />
      <path d="M12.59 9.15131L13.9634 11.1126L17.9064 5.4813C18.441 4.71786 18.2554 3.66563 17.492 3.13107C17.2375 2.95288 16.8868 3.01473 16.7086 3.26922L12.59 9.15131Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.75 2.75C8.75 2.33579 8.41421 2 8 2C7.58579 2 7.25 2.33579 7.25 2.75V3.75H5.5C4.25736 3.75 3.25 4.75736 3.25 6V8.25H20.75V6C20.75 4.75736 19.7426 3.75 18.5 3.75H16.75V2.75C16.75 2.33579 16.4142 2 16 2C15.5858 2 15.25 2.33579 15.25 2.75V3.75H8.75V2.75Z" />
      <path d="M3.25 19V9.75H20.75V19C20.75 20.2426 19.7426 21.25 18.5 21.25H5.5C4.25736 21.25 3.25 20.2426 3.25 19Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 21.75C12.5 21.75 18.5 16.2188 18.5 10.75C18.5 7.16015 15.5899 4.25 12 4.25C8.41015 4.25 5.5 7.16015 5.5 10.75C5.5 16.2188 12.5 21.75 12.5 21.75ZM12 13.25C13.3807 13.25 14.5 12.1307 14.5 10.75C14.5 9.36929 13.3807 8.25 12 8.25C10.6193 8.25 9.5 9.36929 9.5 10.75C9.5 12.1307 10.6193 13.25 12 13.25Z"
      />
    </svg>
  );
}
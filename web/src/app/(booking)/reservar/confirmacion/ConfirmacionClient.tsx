"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Booking } from "@/features/booking/domain/booking.types";

import CheckIcon from "@/components/icons/CheckIcon";
import { SERVICES, BARBERS } from "@/features/booking/domain/booking.logic";
import { SHOP_LOCATION } from "@/features/booking/config/location";

type UIState = "loading" | "success";

export default function ConfirmacionClient({
  bookingId,
}: {
  bookingId: string;
}) {
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [state, setState] = useState<UIState>("loading");
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setState("loading");
      setShowTicket(false);

      try {
        const res = await fetch(
          `/api/booking?id=${encodeURIComponent(bookingId)}`,
          { cache: "no-store" }
        );

        if (res.status === 404) {
          router.replace("/reservar");
          return;
        }

        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "Error cargando reserva");
        if (!alive) return;

        setBooking(json.booking as Booking);
        setState("success");
        setTimeout(() => { if (alive) setShowTicket(true); }, 220);
      } catch {
        router.replace("/reservar");
      }
    }

    load();
    return () => { alive = false; };
  }, [bookingId, router]);

  const barberName = useMemo(() => {
    if (!booking) return "";
    return BARBERS.find((b) => b.id === booking.barberId)?.name ?? booking.barberId;
  }, [booking]);

  const serviceInfo = useMemo(() => {
    if (!booking) return null;
    return SERVICES.find((s) => s.id === booking.service) ?? null;
  }, [booking]);

  const serviceLabel = serviceInfo?.label ?? booking?.service ?? "";
  const duration = serviceInfo?.durationMinutes ?? 30;

  const dateLong = useMemo(() => {
    if (!booking?.date) return "";
    const d = new Date(`${booking.date}T00:00:00`);
    const fmt = new Intl.DateTimeFormat("es-CL", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    const s = fmt.format(d);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }, [booking?.date]);

  const timeRange = useMemo(() => {
    if (!booking?.time) return "";
    const [hh, mm] = booking.time.split(":").map(Number);
    const start = hh * 60 + mm;
    const end = start + duration;
    const fmt = (mins: number) => {
      const h = Math.floor(mins / 60) % 24;
      const m = mins % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };
    return `${fmt(start)} – ${fmt(end)}`;
  }, [booking?.time, duration]);

  return (
    /*
      min-h-dvh usa dvh (dynamic viewport height) que descuenta la barra
      de navegación en Safari móvil — evita el "scroll fantasma"
    */
    <div className="min-h-dvh flex flex-col">
      {/* Área scrolleable — page-container centra el contenido con el mismo max-w que el resto */}
      <div className="flex-1 overflow-auto py-6 pb-40 sm:pb-36">
        <div className="page-container space-y-5">
          {/* Estado: loading / success */}
          <div className="flex flex-col items-center text-center gap-4">
            {state === "loading" ? (
              <>
                <div className="h-20 w-20 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] grid place-items-center">
                  <div className="h-10 w-10 rounded-full border-4 border-white/10 border-t-[rgb(var(--primary))] animate-spin" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Confirmando tu reserva</div>
                  <div className="text-sm text-[rgb(var(--muted))] mt-1">
                    Un momento… estamos guardando tu cita.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="h-20 w-20 rounded-full bg-[rgb(var(--primary))] grid place-items-center pop-in"
                  style={{
                    filter: "drop-shadow(0 18px 50px rgba(212,175,55,0.35))",
                  }}
                >
                  <CheckIcon size={48} className="text-white" />
                </div>
                <div className="pop-in">
                  <div className="text-2xl sm:text-3xl font-extrabold">
                    ¡Cita agendada!
                  </div>
                  <div className="mt-1 text-sm text-[rgb(var(--muted))] max-w-xs mx-auto">
                    Tu reserva fue confirmada. Te enviaremos los detalles por WhatsApp.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Ticket */}
          {booking && showTicket && (
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
                  <div className="text-sm text-[rgb(var(--muted))]">{timeRange}</div>
                </Section>

                <Divider />

                <Section icon={<PinIcon />} title="Ubicación">
                  <div className="text-lg font-semibold">{SHOP_LOCATION.name}</div>
                  <div className="text-sm text-[rgb(var(--muted))]">
                    {SHOP_LOCATION.address}
                  </div>
                </Section>

                <Divider />

                <div className="p-4 space-y-2 text-sm">
                  <Row label="Cliente" value={booking.customerName} />
                  <Row label="Teléfono" value={booking.customerPhone} />
                  <Row label="ID" value={booking.id} mono />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*
        footer-fixed: clase en globals.css
        Usa safe-area-inset-bottom para home bar de iPhone
      */}
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
    <svg width="24" height="24" viewBox="0 0 24 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.25132 3.27236C7.07313 3.01789 6.72238 2.95605 6.46791 3.13424C5.70449 3.66882 5.51897 4.72105 6.05355 5.48448L10.6057 11.9853L8.16317 15.4736L8.16081 15.4769C7.97673 15.4436 7.7871 15.4262 7.5934 15.4262C5.84721 15.4262 4.43164 16.8417 4.43164 18.5879C4.43164 20.3341 5.84721 21.7497 7.5934 21.7497C9.33959 21.7497 10.7552 20.3341 10.7552 18.5879C10.7552 17.8559 10.5064 17.182 10.0888 16.6462L11.9791 13.9467L13.8889 16.6741C13.4844 17.2054 13.2441 17.8686 13.2441 18.5879C13.2441 20.3341 14.6597 21.7497 16.4059 21.7497C18.1521 21.7497 19.5677 20.3341 19.5677 18.5879C19.5677 16.8417 18.1521 15.4262 16.4059 15.4262C16.1994 15.4262 15.9976 15.446 15.8022 15.4837L7.25132 3.27236ZM5.93164 18.5879C5.93164 17.6702 6.67563 16.9262 7.5934 16.9262C8.51116 16.9262 9.25515 17.6702 9.25515 18.5879C9.25515 19.5057 8.51116 20.2497 7.5934 20.2497C6.67563 20.2497 5.93164 19.5057 5.93164 18.5879ZM14.7441 18.5879C14.7441 17.6702 15.4881 16.9262 16.4059 16.9262C17.3237 16.9262 18.0677 17.6702 18.0677 18.5879C18.0677 19.5057 17.3237 20.2497 16.4059 20.2497C15.4881 20.2497 14.7441 19.5057 14.7441 18.5879Z" />
      <path d="M12.59 9.15131L13.9634 11.1126L17.9064 5.4813C18.441 4.71786 18.2554 3.66563 17.492 3.13107C17.2375 2.95288 16.8868 3.01473 16.7086 3.26922L12.59 9.15131Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.75 2.75C8.75 2.33579 8.41421 2 8 2C7.58579 2 7.25 2.33579 7.25 2.75V3.75H5.5C4.25736 3.75 3.25 4.75736 3.25 6V8.25H20.75V6C20.75 4.75736 19.7426 3.75 18.5 3.75H16.75V2.75C16.75 2.33579 16.4142 2 16 2C15.5858 2 15.25 2.33579 15.25 2.75V3.75H8.75V2.75Z" />
      <path d="M3.25 19V9.75H20.75V19C20.75 20.2426 19.7426 21.25 18.5 21.25H5.5C4.25736 21.25 3.25 20.2426 3.25 19ZM7.98438 11.95C7.54255 11.95 7.18438 12.3082 7.18438 12.75C7.18438 13.1918 7.54255 13.55 7.98438 13.55H7.99438C8.4362 13.55 8.79437 13.1918 8.79437 12.75C8.79437 12.3082 8.4362 11.95 7.99438 11.95H7.98438ZM11.9941 11.95C11.5523 11.95 11.1941 12.3082 11.1941 12.75C11.1941 13.1918 11.5523 13.55 11.9941 13.55H12.0041C12.446 13.55 12.8041 13.1918 12.8041 12.75C12.8041 12.3082 12.446 11.95 12.0041 11.95H11.9941ZM16.0039 11.95C15.5621 11.95 15.2039 12.3082 15.2039 16.75C15.2039 13.1918 15.5621 13.55 16.0039 13.55H16.0139C16.4557 13.55 16.8139 13.1918 16.8139 12.75C16.8139 12.3082 16.4557 11.95 16.0139 11.95H16.0039ZM7.98438 15.95C7.54255 15.95 7.18438 16.3082 7.18438 16.75C7.18438 17.1918 7.54255 17.55 7.98438 17.55H7.99438C8.4362 17.55 8.79437 17.1918 8.79437 16.75C8.79437 16.3082 8.4362 15.95 7.99438 15.95H7.98438ZM11.9941 15.95C11.5523 15.95 11.1941 16.3082 11.1941 16.75C11.1941 17.1918 11.5523 17.55 11.9941 17.55H12.0041C12.446 17.55 12.8041 17.1918 12.8041 16.75C12.8041 16.3082 12.446 15.95 12.0041 15.95H11.9941ZM16.0039 15.95C15.5621 15.95 15.2039 16.3082 15.2039 16.75C15.2039 17.1918 15.5621 17.55 16.0039 17.55H16.0139C16.4557 17.55 16.8139 17.1918 16.8139 16.75C16.8139 16.3082 16.4557 15.95 16.0139 15.95H16.0039Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8484 12.5805L11.8501 12.5818C12.1254 12.804 12.519 12.8038 12.7939 12.5809L12.3214 11.9984C12.7939 12.5809 12.7947 12.5802 12.7947 12.5802L12.7958 12.5793L12.799 12.5766L12.8089 12.5685L12.8422 12.5407C12.8701 12.517 12.9095 12.4833 12.9586 12.4399C13.0567 12.3533 13.1941 12.2278 13.3577 12.0676C13.684 11.7478 14.119 11.2851 14.5551 10.7105C15.4146 9.57842 16.3442 7.92636 16.3442 6.03146C16.3442 3.80494 14.5392 2 12.3127 2C10.0862 2 8.28125 3.80494 8.28125 6.03146C8.28125 7.9276 9.21625 9.5802 10.0801 10.7121C10.5186 11.2866 10.9558 11.7493 11.2838 12.0689C11.4483 12.2292 11.5863 12.3546 11.6849 12.4412C11.7343 12.4846 11.7738 12.5183 11.8019 12.5419L11.8353 12.5698L11.8452 12.5779L11.8484 12.5805ZM11.0625 6.03125C11.0625 5.34089 11.6221 4.78125 12.3125 4.78125H12.3225C13.0129 4.78125 13.5725 5.34089 13.5725 6.03125C13.5725 6.72161 13.0129 7.28125 12.3225 7.28125H12.3125C11.6221 7.28125 11.0625 6.72161 11.0625 6.03125Z" />
      <path d="M6.94795 4.67894C6.83907 5.11196 6.78125 5.56526 6.78125 6.03206C6.78125 8.04162 7.61088 9.76378 8.43945 10.9975V20.0885L4.02728 19.008C3.02055 18.7614 2.3125 17.8591 2.3125 16.8226V6.41123C2.3125 4.9519 3.68027 3.87868 5.09771 4.22581L6.94795 4.67894Z" />
      <path d="M16.193 10.9971C17.0181 9.76301 17.8442 8.04081 17.8442 6.03206C17.8442 5.40655 17.7403 4.80529 17.549 4.24458L20.5972 4.9911C21.604 5.23766 22.312 6.14004 22.312 7.17652V17.5879C22.312 19.0472 20.9443 20.1204 19.5268 19.7733L16.193 18.9568V10.9971Z" />
      <path d="M10.9074 13.7492L10.9085 13.7501C11.7347 14.4167 12.9144 14.4151 13.7388 13.7464L13.7399 13.7455L13.7436 13.7425L13.7496 13.7376L13.7652 13.7248C13.7771 13.7149 13.7922 13.7023 13.8102 13.6871C13.8462 13.6567 13.8939 13.6157 13.9517 13.5647C14.067 13.4628 14.2235 13.3198 14.4074 13.1396C14.4961 13.0528 14.5918 12.9566 14.693 12.8514V18.9495L9.93945 20.0903V12.8449C10.045 12.9542 10.1448 13.054 10.2369 13.1437C10.4217 13.3239 10.5789 13.4668 10.6948 13.5686C10.7528 13.6196 10.8007 13.6605 10.8369 13.6909C10.8549 13.7061 10.8701 13.7186 10.8821 13.7285L10.8977 13.7413L10.9037 13.7462L10.9074 13.7492Z" />
    </svg>
  );
}
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LogoAdaptive from "@/components/ui/LogoAdaptative";

const BRAND = {
  name: "La Sucursal Barber Shop",
  tagline: "Reserva tu cita en minutos.",
  addressLine1: "Javiera Carrera 1555, local 2",
  addressLine2: "Temuco, Chile",
  mapsUrl:
    "https://google.com/maps/place/La+Sucursal+Barber+Shop/data=!4m2!3m1!1s0x0:0x1730fafa9606ed96?sa=X&ved=1t:2428&ictx=111",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=La+Sucursal+Barber+Shop&query_place_id=0x1730fafa9606ed96&output=embed&z=17",
  instagramUrl:
    "https://www.instagram.com/lasucursalbarbershop?igsh=MWxwNTUzbXdndm90cA%3D%3D&utm_source=qr",
  tiktokUrl: "https://www.tiktok.com/@lasucursalbarber?_r=1&_t=ZS-943o3wYm6v2",
  facebookUrl: "https://www.facebook.com/share/19wQptrdb4/?mibextid=wwXIfr",
};

export default function MarketingHomePage() {
  return (
    <div className="min-h-dvh">
<div
  className="pointer-events-none fixed inset-0 z-0 dark:opacity-100 opacity-50"
  aria-hidden="true"
  style={{
    background:
      "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,175,55,0.30) 0%, transparent 65%)",
  }}
/>

      {/* ── TOPBAR ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/90 backdrop-blur-md">
        <div className="page-container pt-[calc(env(safe-area-inset-top)+12px)] pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo en topbar — adaptativo dark/light */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-sm font-bold tracking-tight leading-tight truncate">
                {BRAND.name}
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 page-container py-10 space-y-14">
        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] items-center">
          <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Logo hero — protagonista */}
            <LogoAdaptive className="w-80 sm:w-[28rem] h-40 sm:h-52" />

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge>Barbería premium</Badge>
                <Badge>Agenda online</Badge>
                <Badge>Ambiente cómodo</Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
                Más que un corte,{" "}
                <span className="text-[rgb(var(--primary))]">
                  es identidad.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[rgb(var(--muted))] max-w-sm mx-auto lg:mx-0">
                Cortes actuales, barba prolija y terminaciones finas. Elige
                servicio, día y hora en segundos.
              </p>
            </div>

            <Link
              href="/reservar"
              className="btn-gold w-full max-w-[280px] px-6 py-4 text-base text-center block"
              style={{ boxShadow: "0 12px 36px rgba(212,175,55,0.22)" }}
            >
              Reservar hora
            </Link>
          </div>

          {/* Imagen principal del local */}
          <div
            className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] overflow-hidden"
            style={{ boxShadow: "0 2px 40px rgba(0,0,0,0.18)" }}
          >
            <div className="aspect-[4/3] sm:aspect-[16/10] relative">
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-xs text-[rgb(var(--muted))] text-center px-4">
                  Aquí va tu foto/arte principal
                  <br />
                  (corte, local, logo)
                </div>
              </div>
              <div
                className="absolute -inset-24 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(212,175,55,.3), transparent 60%)",
                }}
              />
            </div>
            <div className="p-5 border-t border-[rgb(var(--border))]">
              <div className="text-sm font-semibold">Calidad que se nota</div>
              <div className="text-sm text-[rgb(var(--muted))]">
                Terminaciones prolijas, asesoría y un ambiente cómodo.
              </div>
            </div>
          </div>
        </section>

        {/* ── FILOSOFÍA ─────────────────────────────────────── */}
        <section
          className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 sm:p-8 relative overflow-hidden"
          style={{ boxShadow: "0 2px 32px rgba(0,0,0,0.15)" }}
        >
          <div className="relative z-10 space-y-3 max-w-prose">
            <div className="text-xs tracking-widest text-[rgb(var(--primary))] uppercase font-semibold">
              Nuestra filosofía
            </div>
            <p className="text-sm sm:text-base text-[rgb(var(--muted))] leading-relaxed">
              En La Sucursal no solo cortamos cabello, creamos estilo y actitud.
              Somos un equipo de barberos apasionados dedicados a perfeccionar
              tu imagen en cada visita.
            </p>
          </div>
        </section>

        {/* ── EL LOCAL ──────────────────────────────────────── */}
        <section className="space-y-4">
          <SectionLabel label="El local" title="Más que un corte" />
          <p className="text-sm text-[rgb(var(--muted))] max-w-prose">
            Queremos que te vayas viéndote bien y sintiéndote mejor. Esto es lo
            que encuentras cuando vienes:
          </p>

          <div className="grid gap-3 lg:grid-cols-3">
            <InfoCard
              icon={<StarIcon className="h-5 w-5" />}
              title="Ambiente y atención"
              desc="Espacio cómodo, limpio y con buena energía. Te asesoramos según tu estilo."
            />
            <InfoCard
              icon={<CheckIcon className="h-5 w-5" />}
              title="Detalle en terminaciones"
              desc="Cejas, contornos, degradados y barba con precisión. Acabado fino, sin apuro."
            />
            <InfoCard
              icon={<ClockIcon className="h-5 w-5" />}
              title="Experiencia consistente"
              desc="Puntualidad, agenda ordenada y un servicio que mantiene nivel en cada visita."
            />
          </div>

          <div
            className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] overflow-hidden"
            style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.12)" }}
          >
            <div className="grid md:grid-cols-[.9fr_1.1fr]">
              <div className="p-6 space-y-3">
                <div className="text-sm font-semibold">¿Primera vez?</div>
                <div className="text-sm text-[rgb(var(--muted))]">
                  Reserva "Corte + barba" si quieres un cambio completo, o
                  "Corte" si vienes a mantener tu estilo.
                </div>
                <Link
                  href="/reservar"
                  className="btn-gold inline-flex px-5 py-3 text-sm mt-1"
                  style={{ boxShadow: "0 8px 24px rgba(212,175,55,0.2)" }}
                >
                  Reservar ahora
                </Link>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
                <div className="aspect-[16/9] relative">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-xs text-[rgb(var(--muted))] text-center px-4">
                      Foto del local / equipo / antes-después
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICIOS ─────────────────────────────────────── */}
        <section className="space-y-4">
          <SectionLabel label="Servicios" title="Elige tu estilo" />

          <div className="grid gap-3 sm:grid-cols-3">
            <ServiceCard
              icon={<ScissorsIcon className="h-6 w-6" />}
              title="Corte"
              subtitle="30 min"
              note="Corte + terminaciones"
              price="$15.000"
            />
            <ServiceCard
              icon={<FaceIcon className="h-6 w-6" />}
              title="Barba"
              subtitle="30 min"
              note="Perfilado + toalla caliente"
              price="$10.000"
            />
            <ServiceCard
              icon={<StarIcon className="h-6 w-6" />}
              title="Corte + barba"
              subtitle="60 min"
              note="Servicio completo"
              price="$22.000"
              highlight
            />
          </div>
        </section>

        {/* ── UBICACIÓN ─────────────────────────────────────── */}
        <section className="space-y-4">
          <SectionLabel label="Ubicación" title="Encuéntranos" />

          <div
            className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] overflow-hidden"
            style={{ boxShadow: "0 2px 32px rgba(0,0,0,0.14)" }}
          >
            {/* Vista previa del mapa */}
            <div className="relative w-full h-52 sm:h-64">
              <iframe
                title="Ubicación La Sucursal"
                src={BRAND.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Dirección e ícono de abrir mapa */}
            <div className="p-5 border-t border-[rgb(var(--border))] flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 grid place-items-center flex-shrink-0">
                  <LocationIcon className="h-4 w-4 text-[rgb(var(--primary))]" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {BRAND.addressLine1}
                  </div>
                  <div className="text-xs text-[rgb(var(--muted))]">
                    {BRAND.addressLine2}
                  </div>
                </div>
              </div>
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--primary))]/40 bg-[rgb(var(--surface-2))] px-4 py-2 text-xs font-semibold text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/10 transition-colors"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
                Abrir en Maps
              </a>
            </div>
          </div>
        </section>

        {/* ── HORARIOS ──────────────────────────────────────── */}
        <section className="space-y-4">
          <SectionLabel label="Horarios" title="Cuándo estamos" />

          <div
            className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] overflow-hidden"
            style={{ boxShadow: "0 2px 32px rgba(0,0,0,0.14)" }}
          >
            {/* Cabecera */}
            <div className="px-6 pt-6 pb-4 border-b border-[rgb(var(--border))] flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 grid place-items-center flex-shrink-0">
                <ClockIcon className="h-5 w-5 text-[rgb(var(--primary))]" />
              </div>
              <div>
                <div className="text-sm font-semibold">Horario de atención</div>
                <div className="text-xs text-[rgb(var(--muted))]">
                  Consulta disponibilidad en línea
                </div>
              </div>
            </div>

            {/* Filas */}
            <ul className="divide-y divide-[rgb(var(--border))]">
              <HorarioRow dia="Lunes a Sábado" hora="10:00 – 20:00" />
              <HorarioRow dia="Domingos y feriados" hora="10:00 – 17:00" />
              <HorarioRow dia="Feriados irrenunciables" hora="Cerrado" closed />
            </ul>

            {/* Nota */}
            <div className="px-6 py-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
              <p className="text-xs text-[rgb(var(--muted))] leading-relaxed">
                En feriados regulares abrimos con horario reducido (10:00 –
                17:00). Solo cerramos en feriados irrenunciables.
              </p>
            </div>
          </div>
        </section>

        {/* ── REDES ─────────────────────────────────────────── */}
        <section className="space-y-6">
          <SectionLabel label="Redes" title="Mira nuestro trabajo" />
          <p className="text-sm text-[rgb(var(--muted))] -mt-2">
            Fotos, videos y transformaciones reales.
          </p>

          {/* 3 íconos grandes sin contenedor */}
          <div className="flex items-center justify-center gap-8 py-4">
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="group flex flex-col items-center gap-2.5"
            >
              <div className="h-16 w-16 rounded-full border border-[rgb(var(--primary))]/50 bg-[rgb(var(--surface))] grid place-items-center text-[rgb(var(--primary))] group-hover:bg-[rgb(var(--primary))]/10 group-hover:border-[rgb(var(--primary))] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 active:scale-95">
                <InstagramIcon className="h-7 w-7" />
              </div>
              <span className="text-[10px] text-[rgb(var(--muted))] font-medium tracking-widest uppercase">
                Instagram
              </span>
            </a>

            <a
              href={BRAND.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="group flex flex-col items-center gap-2.5"
            >
              <div className="h-16 w-16 rounded-full border border-[rgb(var(--primary))]/50 bg-[rgb(var(--surface))] grid place-items-center text-[rgb(var(--primary))] group-hover:bg-[rgb(var(--primary))]/10 group-hover:border-[rgb(var(--primary))] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 active:scale-95">
                <TikTokIcon className="h-7 w-7" />
              </div>
              <span className="text-[10px] text-[rgb(var(--muted))] font-medium tracking-widest uppercase">
                TikTok
              </span>
            </a>

            <a
              href={BRAND.facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="group flex flex-col items-center gap-2.5"
            >
              <div className="h-16 w-16 rounded-full border border-[rgb(var(--primary))]/50 bg-[rgb(var(--surface))] grid place-items-center text-[rgb(var(--primary))] group-hover:bg-[rgb(var(--primary))]/10 group-hover:border-[rgb(var(--primary))] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 active:scale-95">
                <FacebookIcon className="h-7 w-7" />
              </div>
              <span className="text-[10px] text-[rgb(var(--muted))] font-medium tracking-widest uppercase">
                Facebook
              </span>
            </a>
          </div>
        </section>

        {/* Safe area bottom */}
        <div className="pb-6" />
      </main>
    </div>
  );
}

/* ============================================================
   HELPER COMPONENTS
   ============================================================ */

function SectionLabel({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[rgb(var(--primary))] uppercase font-semibold mb-1">
        {label}
      </div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-xs font-medium text-[rgb(var(--muted))]">
      {children}
    </span>
  );
}

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 space-y-3"
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.10)" }}
    >
      <div className="h-9 w-9 rounded-full bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 grid place-items-center text-[rgb(var(--primary))]">
        {icon}
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-sm text-[rgb(var(--muted))] leading-relaxed">
        {desc}
      </div>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  subtitle,
  note,
  price,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  note: string;
  price: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-6 space-y-4 flex flex-col justify-between",
        "bg-[rgb(var(--surface))]",
        highlight
          ? "border-[rgb(var(--primary))]/60 ring-1 ring-[rgb(var(--primary))]/30"
          : "border-[rgb(var(--border))]",
      ].join(" ")}
      style={{
        boxShadow: highlight
          ? "0 4px 32px rgba(212,175,55,0.14)"
          : "0 2px 20px rgba(0,0,0,0.10)",
      }}
    >
      <div className="space-y-3">
        <div className="text-[rgb(var(--primary))]">{icon}</div>
        <div>
          <div className="text-base font-bold leading-tight">{title}</div>
          <div className="text-xs text-[rgb(var(--muted))] mt-0.5">
            {subtitle}
          </div>
        </div>
        <div className="text-sm text-[rgb(var(--muted))]">{note}</div>
      </div>
      <div className="pt-3 border-t border-[rgb(var(--border))]">
        <span className="text-lg font-bold text-[rgb(var(--primary))]">
          {price}
        </span>
      </div>
    </div>
  );
}

function HorarioRow({
  dia,
  hora,
  closed,
}: {
  dia: string;
  hora: string;
  closed?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex items-center gap-3">
        <span
          className={[
            "h-2 w-2 rounded-full flex-shrink-0",
            closed ? "bg-[rgb(var(--muted))]/30" : "bg-[rgb(var(--primary))]",
          ].join(" ")}
          aria-hidden="true"
        />
        <span
          className={
            closed ? "text-sm text-[rgb(var(--muted))]" : "text-sm font-medium"
          }
        >
          {dia}
        </span>
      </div>
      <span
        className={[
          "text-sm font-semibold tabular-nums",
          closed ? "text-[rgb(var(--muted))]" : "text-[rgb(var(--primary))]",
        ].join(" ")}
      >
        {hora}
      </span>
    </li>
  );
}

/* ============================================================
   ICONS
   ============================================================ */

function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 6v6l4 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21c-1-1.5-7-8.5-7-12a7 7 0 1 1 14 0c0 3.5-6 10.5-7 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 3h6v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14 21 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 14s1.5 2 4 2 4-2 4-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 9h.01M15 9h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M17.5 6.5h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TikTokIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 3v10.2a3.8 3.8 0 1 1-3-3.72V6.2c.6.2 1.3.3 2 .3 1.6 0 3-.6 4-1.6V3h-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 6.5c.8 1.2 2.1 2 3.6 2.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 8h2V5h-2a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h2.4l.6-3H13V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

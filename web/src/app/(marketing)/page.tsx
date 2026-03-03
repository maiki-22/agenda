import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LogoAdaptive from "@/components/ui/LogoAdaptative";
import localImg from "@/assets/local.webp";
import InstrumentosImg from "@/assets/instrumentos.webp";

const BRAND = {
  name: "La Sucursal Barber Shop",
  tagline: "Reserva tu cita en minutos.",
  addressLine1: "Av. Javiera Carrera 1555, local 2",
  addressLine2: "4810999 Temuco, Araucanía",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.+Javiera+Carrera+1555,+local+2,+4810999+Temuco,+Araucan%C3%ADa",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Av.+Javiera+Carrera+1555,+local+2,+4810999+Temuco,+Araucan%C3%ADa&output=embed&z=17",
  instagramUrl:
    "https://www.instagram.com/lasucursalbarbershop?igsh=MWxwNTUzbXdndm90cA%3D%3D&utm_source=qr",
  tiktokUrl: "https://www.tiktok.com/@lasucursalbarber?_r=1&_t=ZS-943o3wYm6v2",
  facebookUrl: "https://www.facebook.com/share/19wQptrdb4/?mibextid=wwXIfr",
};

export default function MarketingHomePage() {
  return (
    <div className="min-h-dvh">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-50 dark:opacity-100 dark:max-sm:opacity-45"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgb(var(--bg-ambient-2)) 0%, transparent 65%)",
        }}
      />

      {/* ── TOPBAR ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/90 backdrop-blur-md">
        <div className="page-container pt-[calc(env(safe-area-inset-top)+12px)] pb-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <div className="h-10 w-10" aria-hidden="true" />

          <div className="flex flex-col items-center justify-center min-w-0 gap-0.5">
            <span className="text-sm font-semibold tracking-[0.12em] text-[rgb(var(--fg))] uppercase truncate">
              La Sucursal
            </span>
            <span className="flex items-center gap-1.5 opacity-40">
              <span className="block h-px w-6 bg-current" />
              <span className="text-[8px] tracking-[0.3em] uppercase font-medium">
                Barber Shop
              </span>
              <span className="block h-px w-6 bg-current" />
            </span>
          </div>

          <div className="justify-self-end">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 page-container pt-4 pb-8 sm:py-8 lg:py-10 space-y-10 sm:space-y-12">
        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="grid gap-6 lg:gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          {/* LOGO (mobile: 1°, desktop: 1°) */}
          <div className="order-1 flex flex-col items-center lg:items-start lg:self-stretch lg:justify-center">
              <LogoAdaptive className="w-full max-w-[44rem] sm:max-w-[52rem] lg:max-w-[52rem] xl:max-w-[56rem]" />
          </div>

          {/* BLOQUE TEXTO/CTA (mobile: 2°, desktop: debajo de ambos) */}
          <div className="order-2 lg:order-3 lg:col-span-2 text-center lg:text-left">
            <div className="mx-auto lg:mx-0 max-w-[60rem] space-y-4 lg:space-y-5">
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge>Barbería premium</Badge>
                <Badge>Agenda online</Badge>
                <Badge>Ambiente cómodo</Badge>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
                  Más que un corte,{" "}
                  <span className="text-[rgb(var(--primary))]">
                    es identidad.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-[rgb(var(--muted))]">
                  Cortes actuales, barba prolija y terminaciones finas. Elige
                  servicio, día y hora en segundos.
                </p>
              </div>

              <div className="flex justify-center lg:justify-start">
                <Link
                  href="/reservar"
                  className="btn-gold primary-glow w-full max-w-[320px] lg:max-w-[360px] px-6 py-4 text-base text-center block"
                  style={{ boxShadow: "0 12px 36px rgba(212,175,55,0.22)" }}
                >
                  Reservar hora
                </Link>
              </div>
            </div>
          </div>

          {/* IMAGEN LOCAL (mobile: 3°, desktop: 2° a la derecha del logo) */}
          <div
  className="
    order-3 lg:order-2 lg:mt-0
    rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]
    overflow-hidden flex flex-col
    w-full
    lg:max-w-[22rem] xl:max-w-[24rem] 2xl:max-w-[26rem]
    lg:justify-self-end
  "
  style={{ boxShadow: "0 2px 40px rgba(0,0,0,0.18)" }}
>
  {/* Definimos el aspecto EXACTO del recorte: 720/770 */}
  <div className="aspect-[720/770] relative overflow-hidden bg-black">
    <Image
      src={localImg}
      alt="Fachada de La Sucursal Barber Shop - Recorte Controlado"
      fill
      priority
      placeholder="blur"
      sizes="(min-width: 1024px) 45vw, 100vw"
      className="object-cover object-[center_50%]"
    />

    {/* Glow dorado encima mejorado */}
    <div
      className="absolute inset-0 opacity-40 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 50% 20%, rgb(var(--primary-glow) / 0.15), transparent 70%)",
      }}
    />
  </div>

  {/* Footer de la tarjeta */}
  <div className="px-5 py-5 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-1))]">
    <div className="text-sm font-semibold leading-tight text-[rgb(var(--foreground))]">
    La Sucursal
    </div>
    <div className="text-sm text-[rgb(var(--muted))] mt-1 leading-snug">
      Ubicación central, ambiente cómodo y estacionamiento.
    </div>
  </div>
</div>
        </section>

        {/* ── about  ─────────────────────────────────────── */}
        <section
          className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] shadow-[var(--shadow-medium)] p-6 sm:p-8 relative overflow-hidden"
          style={{ boxShadow: "0 2px 32px rgba(0,0,0,0.15)" }}
        >
          <div className="relative z-10 space-y-3 max-w-prose">
            <div className="text-xs tracking-widest text-[rgb(var(--primary))] uppercase font-semibold">
              Sobre nosotros
            </div>
            <p className="text-sm sm:text-base text-[rgb(var(--muted))] leading-relaxed">
              En La Sucursal Barber Shop no solo cortamos cabello, creamos
              estilo y actitud. Somos un equipo de 6 barberos apasionados por
              los detalles, la precisión y la experiencia de cada cliente. Aquí
              combinamos técnica, tendencia y buen ambiente para que cada visita
              sea única.
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

          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="grid md:grid-cols-[.9fr_1.1fr]">
              <div className="p-6 space-y-3">
                <div className="text-sm font-semibold">¿Primera vez?</div>
                <div className="text-sm text-[rgb(var(--muted))]">
                  Reserva &quot;Corte + barba&quot; si quieres un cambio
                  completo, o &quot;Corte&quot; si vienes a mantener tu estilo.
                </div>
                <Link
                  href="/reservar"
                  className="btn-gold primary-glow inline-flex px-5 py-3 text-sm mt-1"
                >
                  Reservar ahora
                </Link>
              </div>
             <div className="border-t md:border-t-0 md:border-l border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] overflow-hidden">
  <div className="aspect-[16/9] relative overflow-hidden">
    <Image
      src={InstrumentosImg}
      alt="Interior de La Sucursal Barber Shop para primera visita"
      fill
      placeholder="blur"
      sizes="(min-width: 768px) 35vw, 100vw"
      className="object-cover object-[center_65%] scale-[1.04]"
    />
  </div>
</div>
            </div>
          </div>
        </section>

        {/* ── SERVICIOS ─────────────────────────────────────── */}
        <section className="space-y-4">
          <SectionLabel label="Servicios" title="Elige tu estilo" />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon={<ScissorsIcon className="h-6 w-6" />}
              title="Corte"
              subtitle=""
              note="Corte + terminaciones"
              price="$13.000"
            />
            <ServiceCard
              icon={<FaceIcon className="h-6 w-6" />}
              title="Barba"
              subtitle=""
              note="Perfilado + toalla caliente"
              price="$10.000"
            />
            <ServiceCard
              icon={<StarIcon className="h-6 w-6" />}
              title="Corte + barba"
              subtitle=""
              note="Servicio completo"
              price="$20.000"
              highlight
            />
            <ServiceCard
              icon={<FaceIcon className="h-6 w-6" />}
              title="Corte y ceja"
              subtitle=""
              note="Corte + perfilado de cejas"
              price="$15.000"
            />
          </div>
        </section>

        {/* ── UBICACIÓN ─────────────────────────────────────── */}
        <section className="space-y-4">
          <SectionLabel label="Ubicación" title="Encuéntranos" />

          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] shadow-[var(--shadow-medium)] overflow-hidden">
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
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--primary))]/40 bg-[rgb(var(--surface-2))] px-4 py-2 text-xs font-semibold text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 focus-visible:ring-offset-2"
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

          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] shadow-[var(--shadow-medium)] overflow-hidden">
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
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group flex flex-col items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 focus-visible:ring-offset-2 rounded-xl"
            >
              <div className="h-16 w-16 rounded-full border border-[rgb(var(--primary))]/50 bg-[rgb(var(--surface))] grid place-items-center text-[rgb(var(--primary))] group-hover:bg-[rgb(var(--primary))]/10 group-hover:border-[rgb(var(--primary))] icon-social transition-all duration-300 active:scale-95">
                <InstagramIcon className="h-7 w-7" />
              </div>
              <span className="text-xs text-[rgb(var(--muted))] font-medium tracking-widest uppercase">
                Instagram
              </span>
            </a>

            <a
              href={BRAND.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="group flex flex-col items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 focus-visible:ring-offset-2 rounded-xl"
            >
              <div className="h-16 w-16 rounded-full border border-[rgb(var(--primary))]/50 bg-[rgb(var(--surface))] grid place-items-center text-[rgb(var(--primary))] group-hover:bg-[rgb(var(--primary))]/10 group-hover:border-[rgb(var(--primary))] icon-social transition-all duration-300 active:scale-95">
                <TikTokIcon className="h-7 w-7" />
              </div>
              <span className="text-xs text-[rgb(var(--muted))] font-medium tracking-widest uppercase">
                TikTok
              </span>
            </a>

            <a
              href={BRAND.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="group flex flex-col items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 focus-visible:ring-offset-2 rounded-xl"
            >
              <div className="h-16 w-16 rounded-full border border-[rgb(var(--primary))]/50 bg-[rgb(var(--surface))] grid place-items-center text-[rgb(var(--primary))] group-hover:bg-[rgb(var(--primary))]/10 group-hover:border-[rgb(var(--primary))] icon-social transition-all duration-300 active:scale-95">
                <FacebookIcon className="h-7 w-7" />
              </div>
              <span className="text-xs text-[rgb(var(--muted))] font-medium tracking-widest uppercase">
                Facebook
              </span>
            </a>
          </div>
          <div className="flex justify-center pt-2">
            <Link
              href="/reservar"
              className="btn-gold primary-glow w-full max-w-[340px] px-6 py-4 text-base text-center block"
            >
              Reservar mi hora
            </Link>
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
    <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] px-3 py-1 text-xs font-medium text-[rgb(var(--muted))] shadow-[0_4px_14px_rgb(var(--primary-glow)/0.08)]">
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
    <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] shadow-[var(--shadow-soft)] p-5 space-y-3">
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
        "bg-[rgb(var(--surface-2))]",
        highlight
          ? "border-[rgb(var(--primary))]/60 ring-1 ring-[rgb(var(--primary))]/30"
          : "border-[rgb(var(--border))]",
      ].join(" ")}
      style={{
        boxShadow: highlight
          ? "0 18px 44px rgb(var(--primary-glow) / 0.2)"
          : "var(--shadow-soft)",
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
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

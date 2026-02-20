import Link from "next/link";
import ThemeToggle from "@/components/theme/ThemeToggle";

const BRAND = {
  name: "La Sucursal Barber Shop",
  tagline: "Reserva tu cita en minutos.",
  addressLine1: "Av. Ejemplo 1234, Santiago",
  addressLine2: "A pasos del metro",
  mapsUrl: "https://www.google.com/maps",
  instagramUrl: "https://instagram.com/",
  tiktokUrl: "https://tiktok.com/",
  facebookUrl: "https://facebook.com/",
};

export default function MarketingHomePage() {
  return (
    <div className="min-h-dvh">
      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))] supports-[backdrop-filter]:bg-[rgb(var(--bg))]/80 backdrop-blur">
        <div className="page-container pt-[calc(env(safe-area-inset-top)+12px)] pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] grid place-items-center">
              <span className="text-sm font-bold"></span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight truncate">
                {BRAND.name}
              </div>
              <div className="text-xs text-[rgb(var(--muted))] truncate">
                {BRAND.tagline}
              </div>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <main className="page-container py-8 space-y-12">
        {/* HERO */}
        <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Barbería premium</Badge>
              <Badge>Agenda online</Badge>
              <Badge>Ambiente cómodo</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Más que un corte,{" "}
              <span className="text-[rgb(var(--primary))]">es identidad</span>
            </h1>

            <p className="text-sm sm:text-base text-[rgb(var(--muted))] max-w-prose">
              Cortes actuales, barba prolija y terminaciones finas. Elige servicio,
              día y hora en segundos.
            </p>

            {/* CTA único protagonista */}
            <div className="pt-1">
              <Link
                href="/reservar"
                className="block rounded-2xl bg-[rgb(var(--primary))] px-5 py-4 text-sm font-semibold text-[rgb(var(--primary-foreground))] text-center hover:brightness-110 active:scale-[0.99]"
                style={{ boxShadow: "0 14px 40px rgba(212,175,55,0.25)" }}
              >
                Reservar hora
              </Link>
            </div>

            {/* Mini info del local */}
            {/* <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <MiniStat title="Duración" value="30–60 min" />
              <MiniStat title="Ubicación" value="Cerca del metro" />
              <MiniStat title="Estilo" value="Clásico + moderno" />
            </div> */}
          </div>

          {/* Imagen principal */}
          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] overflow-hidden">
            <div className="aspect-[4/3] sm:aspect-[16/10] relative">
              {/* Placeholder: cambia por imagen real */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-sm text-[rgb(var(--muted))]">
                  Aquí va tu foto/arte principal (corte, local, logo)
                </div>
              </div>

              <div
                className="absolute -inset-24 opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(212,175,55,.25), transparent 60%)",
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

        {/* EL LOCAL (nuevo) */}
        <section className="space-y-4">
          <div>
            <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
              El local
            </div>
            <h2 className="text-xl font-semibold">Más que un corte</h2>
            <p className="text-sm text-[rgb(var(--muted))] max-w-prose mt-1">
              Queremos que te vayas viéndote bien y sintiéndote mejor. Esto es lo
              que encuentras cuando vienes:
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <InfoCard
              title="Ambiente y atención"
              desc="Espacio cómodo, limpio y con buena energía. Te asesoramos según tu estilo."
            />
            <InfoCard
              title="Detalle en terminaciones"
              desc="Cejas, contornos, degradados y barba con precisión. Acabado fino, sin apuro."
            />
            <InfoCard
              title="Experiencia consistente"
              desc="Puntualidad, agenda ordenada y un servicio que mantiene nivel en cada visita."
            />
          </div>

          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] overflow-hidden">
            <div className="grid md:grid-cols-[.9fr_1.1fr]">
              <div className="p-5 space-y-2">
                <div className="text-sm font-semibold">¿Primera vez?</div>
                <div className="text-sm text-[rgb(var(--muted))]">
                  Reserva “Corte + barba” si quieres un cambio completo, o “Corte”
                  si vienes a mantener tu estilo.
                </div>
                <div className="pt-2">
                  <Link
                    href="/reservar"
                    className="inline-flex rounded-2xl bg-[rgb(var(--primary))] px-4 py-3 text-sm font-semibold text-[rgb(var(--primary-foreground))] hover:brightness-110 active:scale-[0.99]"
                  >
                    Reservar ahora
                  </Link>
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-[rgb(var(--border))]">
                <div className="aspect-[16/9] relative">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-sm text-[rgb(var(--muted))]">
                      Aquí va una foto del local / equipo / antes-después
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="space-y-4">
          <div>
            <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
              Servicios
            </div>
            <h2 className="text-xl font-semibold">Elige tu estilo</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ServiceCard title="Corte" subtitle="30 min" note="Corte + terminaciones" />
            <ServiceCard title="Barba" subtitle="30 min" note="Perfilado + toalla" />
            <ServiceCard
              title="Corte + barba"
              subtitle="60 min"
              note="Servicio completo"
              highlight
            />
          </div>
        </section>

        {/* Experiencia */}
        <section className="space-y-4">
          <div>
            <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
              Experiencia
            </div>
            <h2 className="text-xl font-semibold">Hecho para que vuelvas</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <FeatureCard title="Puntualidad" desc="Agenda clara y sin esperas." />
            <FeatureCard title="Calidad" desc="Detalles que se notan." />
            <FeatureCard title="Ambiente" desc="Un lugar cómodo y pro." />
          </div>
        </section>

        {/* Ubicación (sin CTA extra) */}
        <section className="space-y-4">
          <div>
            <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
              Ubicación
            </div>
            <h2 className="text-xl font-semibold">Encuéntranos</h2>
          </div>

          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 space-y-2">
            <div className="text-sm font-semibold">{BRAND.addressLine1}</div>
            <div className="text-sm text-[rgb(var(--muted))]">{BRAND.addressLine2}</div>

            <a
              href={BRAND.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-sm font-semibold hover:brightness-110 active:scale-[0.99]"
            >
              Abrir en Google Maps
            </a>
          </div>
        </section>

        {/* Redes (UNA sola vez: trio de iconos) */}
        <section className="space-y-4">
          <div>
            <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
              Redes
            </div>
            <h2 className="text-xl font-semibold">Mira nuestro trabajo</h2>
            <p className="text-sm text-[rgb(var(--muted))] mt-1">
              Fotos, videos y transformaciones.
            </p>
          </div>

          <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">Síguenos</div>
              <div className="text-sm text-[rgb(var(--muted))]">
                Instagram · TikTok · Facebook
              </div>
            </div>
            <SocialIcons large />
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 pb-10 text-xs text-[rgb(var(--muted))]">
          © {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-xs text-[rgb(var(--muted))]">
      {children}
    </span>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4">
      <div className="text-xs text-[rgb(var(--muted))]">{title}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 space-y-2">
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-sm text-[rgb(var(--muted))]">{desc}</div>
    </div>
  );
}

function ServiceCard({
  title,
  subtitle,
  note,
  highlight,
}: {
  title: string;
  subtitle: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-5 space-y-2",
        "bg-[rgb(var(--surface))] border-[rgb(var(--border))]",
        highlight ? "ring-2 ring-[rgb(var(--primary))]" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-base font-semibold">{title}</div>
        <div className="text-xs text-[rgb(var(--muted))]">{subtitle}</div>
      </div>
      <div className="text-sm text-[rgb(var(--muted))]">{note}</div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 space-y-2">
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-sm text-[rgb(var(--muted))]">{desc}</div>
    </div>
  );
}

function SocialIcons({ large }: { large?: boolean }) {
  const size = large ? 44 : 36;
  const icon = large ? "h-5 w-5" : "h-4 w-4";
  const base =
    "grid place-items-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] hover:brightness-110 active:scale-[0.99]";
  return (
    <div className="flex items-center gap-2">
      <a
        href={BRAND.instagramUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className={base}
        style={{ width: size, height: size }}
        title="Instagram"
      >
        <InstagramIcon className={icon} />
      </a>
      <a
        href={BRAND.tiktokUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="TikTok"
        className={base}
        style={{ width: size, height: size }}
        title="TikTok"
      >
        <TikTokIcon className={icon} />
      </a>
      <a
        href={BRAND.facebookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Facebook"
        className={base}
        style={{ width: size, height: size }}
        title="Facebook"
      >
        <FacebookIcon className={icon} />
      </a>
    </div>
  );
}

/** Iconos inline (sin librerías). Si usas lucide-react, los reemplazamos por íconos reales. */
function InstagramIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
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
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M14 8h2V5h-2a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h2.4l.6-3H13V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
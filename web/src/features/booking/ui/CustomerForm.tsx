"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function CustomerForm({
  name,
  phone,
  onChange,
  shakeKey,
}: {
  name: string;
  phone: string; // guardamos E.164: +569XXXXXXXX
  onChange: (name: string, phone: string) => void;
  shakeKey?: number; // cambia para disparar shake (cuando intentas avanzar inválido)
}) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [shake, setShake] = useState(false);

  // Autofocus al entrar al step
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Shake cuando cambia shakeKey
  useEffect(() => {
    if (shakeKey == null) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 280);
    return () => clearTimeout(t);
  }, [shakeKey]);

  const phoneDisplay = useMemo(() => toChileDisplay(phone), [phone]);
  const phoneValid = useMemo(() => isValidChileMobileE164(phone), [phone]);

  const showPhoneError = touchedPhone && !phoneValid;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase">
          Tus datos
        </div>
        <div className="text-xl font-semibold">Cliente</div>
      </div>

      {/* Nombre */}
      <div className="space-y-2">
        <label className="text-sm text-[rgb(var(--muted))]">Nombre</label>
        <input
          ref={nameRef}
          value={name}
          onChange={(e) => onChange(e.target.value, phone)}
          placeholder="Ej: Matías"
          className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 text-[rgb(var(--fg))] outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
        />
      </div>

      {/* Teléfono Chile móvil */}
      <div className="space-y-2">
        <label className="text-sm text-[rgb(var(--muted))]">Teléfono</label>

        <div
          className={[
            "flex items-center gap-2 rounded-2xl border bg-[rgb(var(--surface))] px-3 py-2 transition",
            "border-[rgb(var(--border))]",
            showPhoneError
              ? "ring-2 ring-red-500/60"
              : "focus-within:ring-2 focus-within:ring-[rgb(var(--primary))]",
            shake && showPhoneError ? "shake" : "",
          ].join(" ")}
        >
          {/* Prefijo fijo */}
          <div className="flex items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-black/5 dark:bg-white/5 px-3 py-2">
            <span className="text-lg leading-none" aria-hidden>
              🇨🇱
            </span>
            <span className="text-sm font-semibold">+56</span>
          </div>

          {/* Número (9 dígitos; mostramos con formato) */}
          <input
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9 1234 5678"
            value={phoneDisplay}
            onChange={(e) => {
              const nextE164 = normalizeChileToE164(e.target.value);
              onChange(name, nextE164);
            }}
            onBlur={() => setTouchedPhone(true)}
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[rgb(var(--fg))] outline-none"
          />

          {/* Indicador OK */}
          <div
            className={[
              "h-9 w-9 rounded-xl grid place-items-center border",
              phoneValid
                ? "bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                : "border-[rgb(var(--border))] text-[rgb(var(--muted))]",
            ].join(" ")}
            aria-hidden="true"
          >
            {phoneValid ? "✓" : ""}
          </div>
        </div>

        {showPhoneError ? (
          <p className="text-sm text-red-400">
            Ingresa un móvil válido: 9 dígitos (ej: 9 1234 5678)
          </p>
        ) : (
          <p className="text-sm text-[rgb(var(--muted))]">
            Formato: {" "}
            <span className="font-semibold">+569XXXXXXXX</span>.
          </p>
        )}
      </div>
    </div>
  );
}

function normalizeChileToE164(raw: string) {
  const digits = raw.replace(/\D/g, "");

  // Si pegó con 56 incluido
  if (digits.startsWith("56")) {
    const rest = digits.slice(2);
    const trimmed = rest.slice(0, 9);
    return `+56${trimmed}`;
  }

  // Si pegó solo los 9 dígitos
  const trimmed = digits.slice(0, 9);
  return `+56${trimmed}`;
}

function isValidChileMobileE164(e164: string) {
  return /^\+569\d{8}$/.test(e164);
}

function toChileDisplay(e164: string) {
  const digits = e164.replace(/\D/g, "");
  const rest = digits.startsWith("56") ? digits.slice(2) : digits;

  const a = rest.slice(0, 1);
  const b = rest.slice(1, 5);
  const c = rest.slice(5, 9);

  if (!rest) return "";
  if (rest.length <= 1) return a;
  if (rest.length <= 5) return `${a} ${b}`;
  return `${a} ${b} ${c}`.trim();
}

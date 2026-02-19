"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CheckIcon from "@/components/icons/CheckIcon";

export function CustomerForm({
  name,
  phone,
  onChange,
  shakeKey,
}: {
  name: string;
  phone: string;
  onChange: (name: string, phone: string) => void;
  shakeKey?: number;
}) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [shake, setShake] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) nameRef.current?.focus();
  }, []);

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
    <div className="space-y-5">
      <div>
        <div className="text-xs tracking-widest text-[rgb(var(--muted))] uppercase mb-0.5">
          Tus datos
        </div>
        <div className="text-xl font-semibold">Cliente</div>
      </div>

      {/* ── Nombre ── */}
      <div className="space-y-1.5">
  <label
    htmlFor="customer-name"
    className={[
      "text-xs font-medium tracking-wide uppercase transition-colors duration-200",
      nameFocused ? "text-[rgb(var(--primary))]" : "text-[rgb(var(--muted))]",
    ].join(" ")}
  >
    Nombre
  </label>

  <div
    className={[
      "flex items-center gap-2 rounded-2xl border px-3 py-2 transition-all duration-200",
      "bg-[rgb(var(--surface-2))]",
      nameFocused
        ? "border-[rgb(var(--primary))] ring-2 ring-[rgb(var(--primary))]"
        : "border-[rgb(var(--border))]",
    ].join(" ")}
  >
    <input
      id="customer-name"
      ref={nameRef}
      value={name}
      onChange={(e) => onChange(e.target.value, phone)}
      onFocus={() => setNameFocused(true)}
      onBlur={() => setNameFocused(false)}
      placeholder="Ej: Miguel"
      autoComplete="given-name"
      className={[
        "no-focus-outline min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-[rgb(var(--fg))]",
        "outline-none focus:outline-none focus-visible:outline-none",
        "ring-0 focus:ring-0 focus-visible:ring-0",
        "shadow-none focus:shadow-none focus-visible:shadow-none appearance-none",
      ].join(" ")}
    />
  </div>
</div>

      {/* ── Teléfono ── */}
      <div className="space-y-1.5">
        <label
          htmlFor="customer-phone"
          className={[
            "text-xs font-medium tracking-wide uppercase transition-colors duration-200",
            phoneFocused && !showPhoneError
              ? "text-[rgb(var(--primary))]"
              : showPhoneError
              ? "text-red-400"
              : "text-[rgb(var(--muted))]",
          ].join(" ")}
        >
          Teléfono
        </label>

        <div
          className={[
            "flex items-center gap-2 rounded-2xl border px-3 py-2 transition-all duration-200",
            "bg-[rgb(var(--surface-2))]",
            shake && showPhoneError ? "shake" : "",
            showPhoneError
              ? "border-red-500/60 ring-2 ring-red-500/60"
              : phoneFocused
              ? "border-[rgb(var(--primary))] ring-2 ring-[rgb(var(--primary))]"
              : "border-[rgb(var(--border))]",
          ].join(" ")}
        >
          <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[rgb(var(--border))] bg-black/5 dark:bg-white/5 px-3 py-2">
            <span className="text-xs font-bold text-[rgb(var(--muted))]">CL</span>
            <span className="text-sm font-semibold">+56</span>
          </div>

          <input
            id="customer-phone"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="9 1234 5678"
            value={phoneDisplay}
            onChange={(e) => {
              const nextE164 = normalizeChileToE164(e.target.value);
              onChange(name, nextE164);
            }}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => {
              setPhoneFocused(false);
              setTouchedPhone(true);
            }}
            className={[
              "no-focus-outline min-w-0 flex-1 bg-transparent px-2 py-2 text-base text-[rgb(var(--fg))]",
              "outline-none focus:outline-none focus-visible:outline-none",
              "ring-0 focus:ring-0 focus-visible:ring-0",
              "shadow-none focus:shadow-none focus-visible:shadow-none appearance-none",
            ].join(" ")}
          />

          {/* Badge OK */}
          <div
            className={[
              "shrink-0 h-9 w-9 rounded-xl grid place-items-center transition-all duration-300",
              phoneValid
                ? "bg-[rgb(var(--primary))] border border-[rgb(var(--primary))] scale-100"
                : "border border-[rgb(var(--border))] scale-95 opacity-60",
            ].join(" ")}
            aria-hidden="true"
          >
            {phoneValid ? (
              <CheckIcon size={16} className="text-[rgb(var(--on-primary))]" />
            ) : null}
          </div>
        </div>

        <p
          className={[
            "text-xs transition-colors duration-200",
            showPhoneError ? "text-red-400" : "text-[rgb(var(--muted))]",
          ].join(" ")}
          role={showPhoneError ? "alert" : undefined}
        >
          {showPhoneError
            ? "Ingresa un móvil válido: 9 dígitos (ej: 9 1234 5678)"
            : "Formato: +569XXXXXXXX"}
        </p>
      </div>
    </div>
  );
}

function normalizeChileToE164(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const rest = digits.startsWith("56") ? digits.slice(2) : digits;
  return `+56${rest.slice(0, 9)}`;
}

function isValidChileMobileE164(e164: string): boolean {
  return /^\+569\d{8}$/.test(e164);
}

function toChileDisplay(e164: string): string {
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

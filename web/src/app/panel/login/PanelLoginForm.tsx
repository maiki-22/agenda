"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  authLoginSchema,
  type AuthLoginInput,
} from "@/validations/auth-login.schema";

const DEFAULT_LOGIN_ERROR_MESSAGE =
  "No se pudo iniciar sesión. Inténtalo nuevamente.";

export function PanelLoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthLoginInput>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: AuthLoginInput): Promise<void> => {
    setSubmitError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMessage =
          typeof json === "object" &&
          json !== null &&
          "error" in json &&
          typeof json.error === "string"
            ? json.error
            : DEFAULT_LOGIN_ERROR_MESSAGE;

        setSubmitError(errorMessage);
        return;
      }

      router.push("/panel/admin");
      router.refresh();
    } catch {
      setSubmitError(
        "No pudimos conectarnos. Revisa tu internet e inténtalo otra vez.",
      );
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset
        disabled={isSubmitting}
        className="space-y-3 disabled:opacity-70"
      >
        <label className="block space-y-1 text-sm" htmlFor="email">
          <span className="text-[rgb(var(--muted))]">Email</span>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2"
            placeholder="admin@tudominio.com"
          />
          {errors.email ? (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          ) : null}
        </label>

        <label className="block space-y-1 text-sm" htmlFor="password">
          <span className="text-[rgb(var(--muted))]">Contraseña</span>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2"
            placeholder="••••••••"
          />
          {errors.password ? (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          ) : null}
        </label>

        <p aria-live="polite" className="text-sm text-red-500" role="status">
          {submitError}
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[rgb(var(--primary))] px-4 py-2.5 font-medium text-[rgb(var(--on-primary))] disabled:opacity-60"
        >
          {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </fieldset>
    </form>
  );
}

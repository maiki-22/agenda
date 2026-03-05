"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset
        disabled={isSubmitting}
        className="space-y-4 disabled:opacity-70"
      >
        <label className="block space-y-4 text-sm" htmlFor="email">
          <span className="text-[rgb(var(--muted))]">Email</span>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            placeholder="admin@tudominio.com"
          />
          {errors.email ? (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          ) : null}
        </label>

        <label className="block space-y-4 text-sm" htmlFor="password">
          <span className="text-[rgb(var(--muted))]">Contraseña</span>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
            placeholder="••••••••"
          />
          {errors.password ? (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          ) : null}
        </label>

        <p aria-live="polite" className="text-sm text-red-500" role="status">
          {submitError}
        </p>

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
        </Button>
      </fieldset>
    </form>
  );
}

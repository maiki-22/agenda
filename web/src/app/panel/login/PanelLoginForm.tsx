"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/toast-provider";
import {
  authLoginSchema,
  type AuthLoginInput,
} from "@/validations/auth-login.schema";

const DEFAULT_LOGIN_ERROR_MESSAGE =
  "No se pudo iniciar sesión. Inténtalo nuevamente.";

type ApiLoginErrorResponse = {
  error?: string;
};

function getLoginErrorMessage(status: number, fallbackMessage: string): string {
  if (status === 401) return "Email o contraseña incorrectos.";
  if (status === 429)
    return "Demasiados intentos. Espera un momento antes de volver a intentar.";
  if (status >= 500)
    return "Tuvimos un problema interno. Vuelve a intentar en unos minutos.";
  return fallbackMessage;
}

export function PanelLoginForm() {
  const router = useRouter();
  const toast = useToast();
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

      const json: ApiLoginErrorResponse = await res.json().catch(() => ({}));
      if (!res.ok) {
const errorMessage = getLoginErrorMessage(
          res.status,
          typeof json.error === "string"
            ? json.error
            : DEFAULT_LOGIN_ERROR_MESSAGE,
        );

        setSubmitError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      router.push("/panel/admin");
      router.refresh();
    } catch {
      const message =
        "No pudimos conectarnos. Revisa tu internet e inténtalo otra vez.";
      setSubmitError(message);
      toast.error(message);
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/toast-provider";
import {
  authLoginSchema,
  type AuthLoginInput,
} from "@/validations/auth-login.schema";
import { resolvePanelPathByRole } from "./resolve-panel-path-by-role";

const DEFAULT_LOGIN_ERROR_MESSAGE =
  "No se pudo iniciar sesión. Inténtalo nuevamente.";
const DEFAULT_PROFILE_ERROR_MESSAGE =
  "No pudimos cargar tu perfil. Inténtalo nuevamente.";
const MIN_PASSWORD_LENGTH = 8;

const meResponseSchema = z.object({
  profile: z
    .object({
      role: z.string().nullable().optional(),
      barber_id: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  error: z.string().optional(),
});

type ApiErrorResponse = {
  error?: string;
};

function getLoginErrorMessage(status: number, fallbackMessage: string): string {
  if (status === 401) return "Email o contraseña incorrectos.";
  if (status === 429) {
    return "Demasiados intentos. Espera un momento antes de volver a intentar.";
  }
  if (status >= 500) {
    return "Tuvimos un problema interno. Vuelve a intentar en unos minutos.";
  }

  return fallbackMessage;
}

function getProfileErrorMessage(
  status: number,
  fallbackMessage: string,
): string {
  if (status === 401) {
    return "Tu sesión no es válida. Inicia sesión nuevamente.";
  }
  if (status >= 500) {
    return "No pudimos validar tu perfil en este momento. Inténtalo más tarde.";
  }

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

    if (values.password.length < MIN_PASSWORD_LENGTH) {
      const message = "La contraseña debe tener al menos 8 caracteres.";
      setSubmitError(message);
      toast.error(message);
      return;
    }

    try {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const loginJson: ApiErrorResponse = await loginRes
        .json()
        .catch(() => ({}));

      if (!loginRes.ok) {
        const errorMessage = getLoginErrorMessage(
          loginRes.status,
          typeof loginJson.error === "string"
            ? loginJson.error
            : DEFAULT_LOGIN_ERROR_MESSAGE,
        );

        setSubmitError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const meRes = await fetch("/api/me", {
        method: "GET",
        cache: "no-store",
      });
      const meJsonRaw: unknown = await meRes.json().catch(() => ({}));

      if (!meRes.ok) {
        const fallbackMessage =
          meJsonRaw &&
          typeof meJsonRaw === "object" &&
          "error" in meJsonRaw &&
          typeof meJsonRaw.error === "string"
            ? meJsonRaw.error
            : DEFAULT_PROFILE_ERROR_MESSAGE;

        const errorMessage = getProfileErrorMessage(
          meRes.status,
          fallbackMessage,
        );

        setSubmitError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const parsedMeResponse = meResponseSchema.safeParse(meJsonRaw);
      if (!parsedMeResponse.success || !parsedMeResponse.data.profile) {
        const message =
          "No encontramos un perfil asociado a tu cuenta. Contacta al administrador.";
        setSubmitError(message);
        toast.error(message);
        return;
      }

      const destination = resolvePanelPathByRole(
        parsedMeResponse.data.profile.role,
        parsedMeResponse.data.profile.barber_id,
      );

      if (!destination.success) {
        setSubmitError(destination.error);
        toast.error(destination.error);
        return;
      }

      router.replace(destination.path);
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

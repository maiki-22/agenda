export type PanelRole = "admin" | "barber";

type PanelPathResolution =
  | { success: true; path: string }
  | { success: false; error: string };

const INVALID_PROFILE_ERROR_MESSAGE =
  "No pudimos validar tu perfil. Contacta al administrador.";

export function resolvePanelPathByRole(
  role: unknown,
  barberId: unknown,
): PanelPathResolution {
  if (role === "admin") {
    return { success: true, path: "/panel/admin" };
  }

  if (role === "barber") {
    if (typeof barberId !== "string" || barberId.trim().length === 0) {
      return { success: false, error: INVALID_PROFILE_ERROR_MESSAGE };
    }

    return { success: true, path: "/panel/barbero" };
  }

  return {
    success: false,
    error: "Tu cuenta no tiene un rol válido para acceder al panel.",
  };
}

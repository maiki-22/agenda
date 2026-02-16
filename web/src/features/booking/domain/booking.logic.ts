import type { Barber, ServiceType } from "./booking.types";

export const SERVICES: Array<{
  id: ServiceType;
  label: string;
  durationMinutes: number;
}> = [
  { id: "corte", label: "Corte", durationMinutes: 30 },
  { id: "barba", label: "Barba", durationMinutes: 30 },
  { id: "corte_y_barba", label: "Corte + Barba", durationMinutes: 60 },
];

// Mock “empresa”: mañana esto viene de DB (admin puede agregar/quitar).
export const BARBERS: Barber[] = [
  { id: "barber_1", name: "Barbero 1", isActive: true },
  { id: "barber_2", name: "Barbero 2", isActive: true },
  { id: "barber_3", name: "Barbero 3", isActive: true },
  { id: "barber_4", name: "Barbero 4", isActive: true },
  { id: "barber_5", name: "Barbero 5", isActive: true },
];

export function getServiceDurationMinutes(service: ServiceType): number {
  const s = SERVICES.find((x) => x.id === service);
  return s?.durationMinutes ?? 30;
}

export function normalizePhone(input: string): string {
  // Muy simple para MVP: deja solo dígitos y + al inicio si existe.
  // Luego puedes robustecer con libphonenumber.
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return "";
  return hasPlus ? `+${digits}` : digits;
}

export function isValidTimeHHmm(time: string): boolean {
  return /^\d{2}:\d{2}$/.test(time);
}

export function isValidISODate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function generateSlots(
  startHHmm = "09:00",
  endHHmm = "18:00",
  stepMinutes = 30
): string[] {
  const [sh, sm] = startHHmm.split(":").map(Number);
  const [eh, em] = endHHmm.split(":").map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;

  const out: string[] = [];
  for (let t = start; t <= end - stepMinutes; t += stepMinutes) {
    const hh = String(Math.floor(t / 60)).padStart(2, "0");
    const mm = String(t % 60).padStart(2, "0");
    out.push(`${hh}:${mm}`);
  }
  return out;
}
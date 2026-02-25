export type Barber = {
  id: string;
  name: string;
  isActive: boolean;
};

export function normalizePhone(input: string): string {
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
  stepMinutes = 30,
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
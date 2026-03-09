function normalizeDateInput(input: string | Date): Date | null {
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input;
  }

  const isoDateMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    const year = Number(isoDateMatch[1]);
    const month = Number(isoDateMatch[2]);
    const day = Number(isoDateMatch[3]);
    const parsed = new Date(year, month - 1, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateShortCL(input: string | Date): string {
  const parsed = normalizeDateInput(input);
  if (!parsed) {
    return typeof input === "string" ? input : "";
  }

  const formatter = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const parts = formatter.formatToParts(parsed);
  const day = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  if (!day || !month || !year) {
    return typeof input === "string" ? input : "";
  }

  return `${day}-${month}-${year}`;
}

export function formatDateLongCL(input: string | Date): string {
  const parsed = normalizeDateInput(input);
  if (!parsed) {
    return typeof input === "string" ? input : "";
  }

  const formatter = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formatter.format(parsed).replace(",", "");
}

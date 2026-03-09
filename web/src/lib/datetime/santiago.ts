const SANTIAGO_TIME_ZONE = "America/Santiago";

function parseIsoDate(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

function parseOffsetToMinutes(offsetLabel: string): number {
  const normalized = offsetLabel.replace("GMT", "");
  const match = normalized.match(/^([+-])(\d{1,2})(?::(\d{2}))?$/);

  if (!match) {
    return 0;
  }

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? "0");
  return sign * (hours * 60 + minutes);
}

function getOffsetMinutes(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const offsetLabel = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+0";
  return parseOffsetToMinutes(offsetLabel);
}

function zonedDateTimeToUtc(
  date: string,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  timeZone: string,
): Date {
  const { year, month, day } = parseIsoDate(date);
  let utcEpoch = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);

  for (let i = 0; i < 3; i += 1) {
    const offsetMinutes = getOffsetMinutes(timeZone, new Date(utcEpoch));
    const nextEpoch = Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
      - (offsetMinutes * 60 * 1000);

    if (nextEpoch === utcEpoch) {
      break;
    }

    utcEpoch = nextEpoch;
  }

  return new Date(utcEpoch);
}

export function getSantiagoDayBounds(date: string): {
  startAtIso: string;
  endAtIso: string;
} {
  const startAt = zonedDateTimeToUtc(date, 0, 0, 0, 0, SANTIAGO_TIME_ZONE);
  const endAt = zonedDateTimeToUtc(date, 23, 59, 59, 999, SANTIAGO_TIME_ZONE);

  return {
    startAtIso: startAt.toISOString(),
    endAtIso: endAt.toISOString(),
  };
}

export function formatDateInSantiago(isoDateTime: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: SANTIAGO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date(isoDateTime));
}

export function formatTimeInSantiago(isoDateTime: string): string {
  const formatter = new Intl.DateTimeFormat("es-CL", {
    timeZone: SANTIAGO_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(new Date(isoDateTime));
}
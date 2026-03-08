import { supabaseAdmin } from "@/lib/supabase/admin";
import { AGENDA_BLOCKING_APPOINTMENT_STATUSES } from "../domain/appointment-status";
import type { AvailabilityResult } from "../domain/booking.types";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHmm(totalMinutes: number): string {
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

function dowFromISO(dateYYYYMMDD: string): number {
  const [y, m, d] = dateYYYYMMDD.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

function hhmmInSantiago(isoOrTz: string): string {
  const dt = new Date(isoOrTz);
  const parts = new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(dt);

  const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hh}:${mm}`;
}

type AvailabilityQueryV2 = {
  barberId: string;
  date: string; // YYYY-MM-DD
  durationMinutes?: number;
};

export async function getAvailability(
  q: AvailabilityQueryV2,
): Promise<AvailabilityResult> {
  const duration = q.durationMinutes ?? 30;
  const dow = dowFromISO(q.date);

  // 1) Cierre global
  const { data: closed } = await supabaseAdmin
    .from("shop_closed_days")
    .select("date")
    .eq("date", q.date)
    .maybeSingle();

  if (closed) return { slots: [] };

  // 2) Día libre del barbero
  const { data: dayOff } = await supabaseAdmin
    .from("barber_days_off")
    .select("date")
    .eq("barber_id", q.barberId)
    .eq("date", q.date)
    .maybeSingle();

  if (dayOff) return { slots: [] };

  // 3) Horario del barbero para ese día
  const { data: sched, error: schedErr } = await supabaseAdmin
    .from("barber_schedules")
    .select("start_time,end_time,break_start,break_end")
    .eq("barber_id", q.barberId)
    .eq("dow", dow)
    .eq("active", true)
    .maybeSingle();

  if (schedErr) throw schedErr;
  if (!sched) return { slots: [] };

  const startMin = toMinutes(String(sched.start_time).slice(0, 5));
  const endMin = toMinutes(String(sched.end_time).slice(0, 5));

  // 4) Reservas existentes del día
  const { data: takenRows, error: takenErr } = await supabaseAdmin
    .from("appointments")
    .select("start_at,end_at")
    .eq("barber_id", q.barberId)
    .eq("date", q.date)
    .in("status", [...AGENDA_BLOCKING_APPOINTMENT_STATUSES]);

  if (takenErr) throw takenErr;

 const taken: Array<{ start: number; end: number }> = (takenRows ?? []).map((b) => {
    const startHHmm = hhmmInSantiago(b.start_at);
    const endHHmm = hhmmInSantiago(b.end_at);
    return {
      start: toMinutes(startHHmm),
      end: toMinutes(endHHmm),
    };
  });

  // 5) Colación como ocupado
  if (sched.break_start && sched.break_end) {
    const bs = toMinutes(String(sched.break_start).slice(0, 5));
    const be = toMinutes(String(sched.break_end).slice(0, 5));
    taken.push({ start: bs, end: be });
  }

  // 6) Bloqueos por rango (barber_blocks) filtrados por fecha
  const { data: blocks, error: blocksErr } = await supabaseAdmin
    .from("barber_blocks")
    .select("start_at,end_at")
    .eq("barber_id", q.barberId)
    .eq("date", q.date);

  if (blocksErr) throw blocksErr;

  for (const b of blocks ?? []) {
    const startHHmm = hhmmInSantiago(b.start_at);
    const endHHmm = hhmmInSantiago(b.end_at);

    const bs = toMinutes(startHHmm);
    const be = toMinutes(endHHmm);

    if (be <= bs) {
      taken.push({ start: bs, end: 24 * 60 });
      taken.push({ start: 0, end: be });
    } else {
      taken.push({ start: bs, end: be });
    }
  }

  // 7) Generar slots (paso 30min)
  const step = 30;
  const out: string[] = [];

  for (let t = startMin; t <= endMin - duration; t += step) {
    const aStart = t;
    const aEnd = t + duration;

    const ok = taken.every((x) => !overlaps(aStart, aEnd, x.start, x.end));
    if (ok) out.push(toHHmm(t));
  }

  return { slots: out };
}

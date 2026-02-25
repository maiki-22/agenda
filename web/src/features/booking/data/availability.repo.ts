import { supabaseServer } from "@/lib/supabase/server";
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
  // Día local del servidor (suficiente para DOW). 0=Sunday
  return new Date(y, m - 1, d).getDay();
}

type AvailabilityQueryV2 = {
  barberId: string;
  date: string; // YYYY-MM-DD
  durationMinutes?: number;
};

export async function getAvailability(q: AvailabilityQueryV2): Promise<AvailabilityResult> {
  const duration = q.durationMinutes ?? 30;
  const dow = dowFromISO(q.date);

  // 1) Cierre global
  const { data: closed } = await supabaseServer
    .from("shop_closed_days")
    .select("date")
    .eq("date", q.date)
    .maybeSingle();

  if (closed) return { slots: [] };

  // 2) Día libre del barbero
  const { data: dayOff } = await supabaseServer
    .from("barber_days_off")
    .select("date")
    .eq("barber_id", q.barberId)
    .eq("date", q.date)
    .maybeSingle();

  if (dayOff) return { slots: [] };

  // 3) Horario del barbero para ese día
  const { data: sched, error: schedErr } = await supabaseServer
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
  const { data: takenRows, error: takenErr } = await supabaseServer
    .from("appointments")
    .select("time,duration_min")
    .eq("barber_id", q.barberId)
    .eq("date", q.date)
    .eq("status", "booked");

  if (takenErr) throw takenErr;

  const taken: Array<{ start: number; end: number }> = (takenRows ?? []).map((b) => {
    const s = toMinutes(b.time);
    return { start: s, end: s + (b.duration_min ?? 30) };
  });

  // 5) Agregar colación como ocupado
  if (sched.break_start && sched.break_end) {
    const bs = toMinutes(String(sched.break_start).slice(0, 5));
    const be = toMinutes(String(sched.break_end).slice(0, 5));
    taken.push({ start: bs, end: be });
  }

  // 6) Generar slots (paso 30min como tu UI)
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
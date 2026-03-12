import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  getAuthenticatedPanelUser,
  isAuthenticatedPanelUser,
} from "@/lib/auth/get-authenticated-panel-user";
import {
  panelScheduleBodySchema,
  panelScheduleQuerySchema,
} from "@/validations/panel-schedule.schema";
import type { BarberScheduleResponse, ScheduleDay, ServiceResult } from "@/types/panel";

type ScheduleRow = {
  dow: number;
  active: boolean;
  start_time: string;
  end_time: string;
  break_start: string | null;
  break_end: string | null;
};

const DEFAULT_DAY: Omit<ScheduleDay, "dow"> = {
  active: false,
  startTime: "09:00",
  endTime: "18:00",
  breaks: [],
};

function buildScheduleResponse(barberId: string, rows: ScheduleRow[]): BarberScheduleResponse {
  const rowMap = new Map<number, ScheduleRow>(rows.map((row) => [row.dow, row]));

  const days = Array.from({ length: 7 }, (_, dow) => {
    const row = rowMap.get(dow);
    if (!row) {
      return { dow, ...DEFAULT_DAY } satisfies ScheduleDay;
    }

    return {
      dow,
      active: row.active,
      startTime: row.start_time.slice(0, 5),
      endTime: row.end_time.slice(0, 5),
      breaks:
        row.break_start && row.break_end
          ? [
              {
                startTime: row.break_start.slice(0, 5),
                endTime: row.break_end.slice(0, 5),
              },
            ]
          : [],
    } satisfies ScheduleDay;
  });

  return { barberId, days };
}

export async function GET(req: Request): Promise<NextResponse<ServiceResult<BarberScheduleResponse>>> {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!isAuthenticatedPanelUser(panelUser)) {
    return NextResponse.json(
      { success: false, error: panelUser.error, code: panelUser.error },
      { status: panelUser.status },
    );
  }

  const queryResult = panelScheduleQuerySchema.safeParse(
    Object.fromEntries(new URL(req.url).searchParams.entries()),
  );

  if (!queryResult.success) {
    return NextResponse.json(
      { success: false, error: "Parámetros inválidos", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  if (panelUser.role === "barber" && panelUser.barberId !== queryResult.data.barberId) {
    return NextResponse.json(
      { success: false, error: "No tienes permiso para este barbero", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const { data, error } = await supabase
    .from("barber_schedules")
    .select("dow, active, start_time, end_time, break_start, break_end")
    .eq("barber_id", queryResult.data.barberId)
    .order("dow", { ascending: true });

  if (error) {
    return NextResponse.json(
      { success: false, error: "No se pudo obtener el horario", code: error.code },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: buildScheduleResponse(queryResult.data.barberId, (data ?? []) as ScheduleRow[]),
    },
    { status: 200 },
  );
}

export async function PUT(req: Request): Promise<NextResponse<ServiceResult<{ ok: true }>>> {
  const supabase = await supabaseServer();
  const panelUser = await getAuthenticatedPanelUser(supabase);

  if (!isAuthenticatedPanelUser(panelUser)) {
    return NextResponse.json(
      { success: false, error: panelUser.error, code: panelUser.error },
      { status: panelUser.status },
    );
  }

  const parsedBody = panelScheduleBodySchema.safeParse(await req.json().catch(() => ({})));

  if (!parsedBody.success) {
    return NextResponse.json(
      { success: false, error: "Datos inválidos para guardar el horario", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  if (panelUser.role === "barber" && panelUser.barberId !== parsedBody.data.barberId) {
    return NextResponse.json(
      { success: false, error: "No tienes permiso para editar este horario", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const payload = parsedBody.data.days.map((day) => ({
    barber_id: parsedBody.data.barberId,
    dow: day.dow,
    active: day.active,
    start_time: day.startTime,
    end_time: day.endTime,
    break_start: day.breaks[0]?.startTime ?? null,
    break_end: day.breaks[0]?.endTime ?? null,
  }));

  const { error } = await supabase
    .from("barber_schedules")
    .upsert(payload, { onConflict: "barber_id,dow" });

  if (error) {
    return NextResponse.json(
      { success: false, error: "No se pudo guardar el horario", code: error.code },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: { ok: true } }, { status: 200 });
}
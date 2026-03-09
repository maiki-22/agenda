import { NextResponse } from "next/server";
import { BookingDraftSchema } from "@/features/booking/domain/booking.schema";
import { listServices } from "@/features/booking/data/catalog.repo";

import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  createBookingConfirmationToken,
  generateBookingOpaqueToken,
  verifyBookingConfirmationToken,
} from "@/lib/booking-confirmation-token";
import {
  applyRateLimitHeaders,
  bookingRatelimit,
  limitWithFailover,
} from "@/lib/ratelimit";
import {
  BookingConfirmationActionSchema,
  BookingConfirmationRequestSchema,
} from "@/validations/booking-confirmation.schema";
import { CancelReasonSchema } from "@/validations/cancel-reason.schema";
import { ConfirmationTokenSchema } from "@/validations/confirmation-token.schema";

const BookingActionRequestSchema = BookingConfirmationActionSchema.extend({
  cancelReason: CancelReasonSchema.optional(),
});

type BookingRow = {
  id: string;
  barber_id: string;
  service_id: string;
  date: string;
  time: string;
  duration_min: number;
  customer_name: string;
  customer_phone: string;
  status: string;
  created_at: string;
  confirmation_token: string | null;
  barbers: { name: string } | null;
  services: { name: string; price_clp: number } | null;
};

type ConfirmOrCancelBookingRow = {
  booking_id: string;
  status: string;
};

function getClientIp(req: Request): string {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function getTokenFromHeader(
  authorizationHeader: string | undefined,
): string | null {
  if (!authorizationHeader) return null;
  if (!authorizationHeader.startsWith("Bearer ")) return null;
  return authorizationHeader.slice("Bearer ".length).trim() || null;
}

function maskPhone(phone: string): string {
  const onlyDigits = phone.replace(/\D/g, "");
  if (onlyDigits.length < 4) return "***";
  const tail = onlyDigits.slice(-4);
  return `***${tail}`;
}

function getErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return null;
  }

  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  
    if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return "Error desconocido";
}

function logBookingValidationIssues(issues: unknown): void {
  console.error(
    "BOOKING_400_ISSUES",
    JSON.stringify(issues, null, 2),
  );
}

function logBookingRpcError(error: unknown): void {
  const payload =
    typeof error === "object" && error !== null
      ? {
          code:
            "code" in error && typeof (error as { code?: unknown }).code === "string"
              ? (error as { code: string }).code
              : null,
          message: getErrorMessage(error),
          details:
            "details" in error &&
            typeof (error as { details?: unknown }).details === "string"
              ? (error as { details: string }).details
              : null,
          hint:
            "hint" in error && typeof (error as { hint?: unknown }).hint === "string"
              ? (error as { hint: string }).hint
              : null,
        }
      : { message: getErrorMessage(error) };

  console.error("BOOKING_RPC_ERROR", JSON.stringify(payload, null, 2));
}

function mapBookingMutationError(error: {
  code: string | null;
  message: string;
}): { status: number; code: string; error: string } {
  if (error.code === "23P01" || error.message === "SLOT_TAKEN") {
    return { status: 409, code: "SLOT_TAKEN", error: "Horario no disponible" };
  }

  if (error.code === "P0001" && error.message === "BOOKING_NOT_UPDATABLE") {
    return {
      status: 409,
      code: "BOOKING_NOT_UPDATABLE",
      error: "La reserva no se pudo actualizar o el token ya fue utilizado",
    };
  }

  if (error.code === "P0001" && error.message === "INVALID_ACTION") {
    return {
      status: 400,
      code: "INVALID_ACTION",
      error: "Acción inválida para la reserva",
    };
  }

  return { status: 400, code: error.code ?? "DB_ERROR", error: error.message };
}

async function ensureConfirmationToken(
  appointmentId: string,
  currentToken: string | null,
): Promise<
  | { success: true; confirmationToken: string }
  | { success: false; error: string }
> {
  if (currentToken) {
    return { success: true, confirmationToken: currentToken };
  }

  const nextToken = generateBookingOpaqueToken();
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .update({ confirmation_token: nextToken })
    .eq("id", appointmentId)
    .is("confirmation_token", null)
    .select("confirmation_token")
    .maybeSingle<{ confirmation_token: string | null }>();

  if (error) {
    return { success: false, error: error.message };
  }

  if (data?.confirmation_token) {
    return {
      success: true,
      confirmationToken: data.confirmation_token,
    };
  }

  const { data: current, error: currentError } = await supabaseAdmin
    .from("appointments")
    .select("confirmation_token")
    .eq("id", appointmentId)
    .maybeSingle<{ confirmation_token: string | null }>();

  if (currentError || !current?.confirmation_token) {
    return {
      success: false,
      error: currentError?.message ?? "Missing confirmation token",
    };
  }

  return {
    success: true,
    confirmationToken: current.confirmation_token,
  };
}

function extractToken(
  req: Request,
): { success: true; token: string } | { success: false; response: Response } {
  const { searchParams } = new URL(req.url);
  const parsedInput = BookingConfirmationRequestSchema.safeParse({
    queryToken: searchParams.get("token") ?? undefined,
    authorizationHeader: req.headers.get("authorization") ?? undefined,
  });

  if (!parsedInput.success) {
    const message = parsedInput.error.issues[0]?.message ?? "Input inválido";
    return {
      success: false,
      response: NextResponse.json(
        { error: message, code: "INVALID_INPUT" },
        { status: 400 },
      ),
    };
  }

  const token =
    parsedInput.data.queryToken ??
    getTokenFromHeader(parsedInput.data.authorizationHeader) ??
    "";

  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Token de confirmación inválido",
          code: "INVALID_CONFIRMATION_TOKEN",
        },
        { status: 401 },
      ),
    };
  }

  return { success: true, token };
}

export async function GET(req: Request): Promise<Response> {
  const tokenResult = extractToken(req);

  if (!tokenResult.success) {
    return tokenResult.response;
  }

  const verified = verifyBookingConfirmationToken(tokenResult.token);

  if (!verified.success) {
    return NextResponse.json(
      { error: verified.error, code: "INVALID_CONFIRMATION_TOKEN" },
      { status: 401 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select(
      `
      id,
      barber_id,
      service_id,
      date,
      time,
      duration_min,
      customer_name,
      customer_phone,
      status,
      created_at,
      confirmation_token,
      barbers ( name ),
      services ( name, price_clp )
    `,
    )
    .eq("id", verified.claims.booking_id)
    .eq("confirmation_token", verified.claims.booking_token)
    .maybeSingle<BookingRow>();

  if (error) {
    return NextResponse.json(
      { error: error.message, code: "DB_ERROR" },
      { status: 400 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Reserva no encontrada", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const booking = {
    id: data.id,
    date: data.date,
    time: data.time,
    durationMinutes: data.duration_min,
    status: data.status,
    createdAt: data.created_at,
    customerName: data.customer_name,
    customerPhoneMasked: maskPhone(data.customer_phone),
    barberName: data.barbers?.name ?? data.barber_id,
    serviceName: data.services?.name ?? data.service_id,
    servicePriceClp: data.services?.price_clp ?? null,
  };

  return NextResponse.json({ booking }, { status: 200 });
}

export async function PATCH(req: Request): Promise<Response> {
  const tokenResult = extractToken(req);

  if (!tokenResult.success) {
    return tokenResult.response;
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  const parsedBody = BookingActionRequestSchema.safeParse({
    ...(typeof body === "object" && body !== null ? body : {}),
    token: tokenResult.token,
  });

  if (!parsedBody.success) {
    const message = parsedBody.error.issues[0]?.message ?? "Body inválido";
    return NextResponse.json(
      { error: message, code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  const verified = verifyBookingConfirmationToken(parsedBody.data.token);

  if (!verified.success) {
    return NextResponse.json(
      { error: verified.error, code: "INVALID_CONFIRMATION_TOKEN" },
      { status: 401 },
    );
  }

  const parsedConfirmationToken = ConfirmationTokenSchema.safeParse(
    verified.claims.booking_token,
  );

  if (!parsedConfirmationToken.success) {
    return NextResponse.json(
      {
        error: "Token de confirmación inválido",
        code: "INVALID_CONFIRMATION_TOKEN",
      },
      { status: 401 },
    );
  }

  const { data, error } = await supabaseAdmin.rpc(
    "confirm_or_cancel_booking_by_token",
    {
      p_booking_id: verified.claims.booking_id,
      p_booking_token: parsedConfirmationToken.data,
      p_action: parsedBody.data.action,
      p_cancel_reason: parsedBody.data.cancelReason ?? null,
    },
  );

  if (error) {
    const mapped = mapBookingMutationError({
      code: getErrorCode(error),
      message: getErrorMessage(error),
    });

    return NextResponse.json(
      { error: mapped.error, code: mapped.code },
      { status: mapped.status },
    );
  }

  const booking = Array.isArray(data)
    ? (data[0] as ConfirmOrCancelBookingRow | undefined)
    : undefined;

  if (!booking) {
    return NextResponse.json(
      {
        error: "La reserva no se pudo actualizar o el token ya fue utilizado",
        code: "BOOKING_NOT_UPDATABLE",
      },
      { status: 409 },
    );
  }

  return NextResponse.json(
    { success: true, bookingId: booking.booking_id, status: booking.status },
    { status: 200 },
  );
}

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);
  const rl = await limitWithFailover({
    ratelimit: bookingRatelimit,
    key: `ip:${ip}`,
    fallbackLimit: 8,
    circuitKey: "booking",
  });

  if (!rl.success) {
    const res = NextResponse.json(
      { error: "Too many requests", code: "RATE_LIMITED" },
      { status: 429 },
    );
    applyRateLimitHeaders(res, rl);
    return res;
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  const draftResult = BookingDraftSchema.safeParse(body);

  if (!draftResult.success) {
    logBookingValidationIssues(draftResult.error.issues);
    const message = draftResult.error.issues[0]?.message ?? "Body inválido";
    return NextResponse.json(
      { error: message, code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  const draft = draftResult.data;

  const services = await listServices();
  const svc = services.find((s) => s.id === draft.service);
  if (!svc) {
    return NextResponse.json(
      { error: "Servicio inválido", code: "INVALID_SERVICE" },
      { status: 400 },
    );
  }

  const { data: bookingId, error } = await supabaseAdmin.rpc("create_booking", {
    p_barber_id: draft.barberId,
    p_service_id: draft.service,
    p_date: draft.date,
    p_time: draft.time,
    p_duration_min: svc.duration_min,
    p_customer_name: draft.customerName,
    p_customer_phone: draft.customerPhone,
  });

  if (error) {
    logBookingRpcError(error);
    const errorCode = getErrorCode(error);
    const errorMessage = getErrorMessage(error);

    if (errorCode === "P0001" && errorMessage.includes("MIN_LEAD_TIME")) {
      return NextResponse.json(
        {
          error: "Debes reservar con al menos 30 minutos de anticipación",
          code: "MIN_LEAD_TIME",
        },
        { status: 400 },
      );
    }

    if (errorCode === "23P01") {
      return NextResponse.json(
        { error: "Horario no disponible", code: "SLOT_TAKEN" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: errorMessage, code: errorCode ?? "DB_ERROR" },
      { status: 400 },
    );
  }

  if (typeof bookingId !== "string" || bookingId.length === 0) {
    return NextResponse.json(
      { error: "No se pudo crear la reserva", code: "INVALID_BOOKING_ID" },
      { status: 500 },
    );
  }

  const { data: appointment, error: fetchError } = await supabaseAdmin
    .from("appointments")
    .select("confirmation_token")
    .eq("id", bookingId)
    .maybeSingle<{ confirmation_token: string | null }>();

  if (fetchError) {
    return NextResponse.json(
      { error: fetchError.message, code: "DB_ERROR" },
      { status: 400 },
    );
  }

  const confirmationTokenResult = await ensureConfirmationToken(
    bookingId,
    appointment?.confirmation_token ?? null,
  );

  if (!confirmationTokenResult.success) {
    return NextResponse.json(
      {
        error: "No se pudo generar token de confirmación",
        code: "BOOKING_TOKEN_ERROR",
      },
      { status: 500 },
    );
  }

  let confirmationToken: string;

  try {
    confirmationToken = createBookingConfirmationToken({
      bookingId,
      bookingToken: confirmationTokenResult.confirmationToken,
    });
  } catch {
    return NextResponse.json(
      {
        error: "No se pudo generar el enlace de confirmación",
        code: "BOOKING_CONFIRMATION_CONFIG_ERROR",
      },
      { status: 500 },
    );
  }

  const confirmationUrl = `/reservar/confirmacion?token=${encodeURIComponent(confirmationToken)}`;

  const res = NextResponse.json(
    { bookingToken: confirmationToken, confirmationUrl },
    { status: 201 },
  );
  applyRateLimitHeaders(res, rl);
  return res;
}
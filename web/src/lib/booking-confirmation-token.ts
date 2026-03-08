import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import {
  BookingConfirmationClaimsSchema,
  type BookingConfirmationClaims,
} from "@/validations/booking-confirmation.schema";

const TOKEN_ISSUER = "agenda-booking";
const TOKEN_AUDIENCE = "booking-confirmation";
const DEFAULT_EXPIRATION_SECONDS = 60 * 60 * 24;
const MIN_EXPIRATION_HOURS = 24;
const MAX_EXPIRATION_HOURS = 48;

type TokenResult =
  | { success: true; claims: BookingConfirmationClaims }
  | { success: false; error: string };

function toBase64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(`${normalized}${padding}`, "base64");
}

function getSecret(): string {
  const secret = process.env.BOOKING_TOKEN_SECRET;

  if (!secret || secret.trim().length < 32) {
    throw new Error("BOOKING_TOKEN_SECRET no está configurado correctamente");
  }

  return secret;
}

function getDefaultExpirationSeconds(): number {
  const raw = process.env.BOOKING_TOKEN_EXPIRATION_HOURS;

  if (!raw) return DEFAULT_EXPIRATION_SECONDS;

  const value = Number(raw);
  if (!Number.isFinite(value)) return DEFAULT_EXPIRATION_SECONDS;

  const boundedHours = Math.min(Math.max(Math.floor(value), MIN_EXPIRATION_HOURS), MAX_EXPIRATION_HOURS);
  return boundedHours * 60 * 60;
}

function sign(input: string, secret: string): string {
  const digest = createHmac("sha256", secret).update(input).digest();
  return toBase64Url(digest);
}

export function generateBookingOpaqueToken(): string {
  return toBase64Url(randomBytes(32));
}

export function createBookingConfirmationToken(input: {
  bookingId: string;
  bookingToken: string;
  now?: number;
  expiresInSeconds?: number;
}): string {
  const now = input.now ?? Math.floor(Date.now() / 1000);
  const exp = now + (input.expiresInSeconds ?? getDefaultExpirationSeconds());

  const payload: BookingConfirmationClaims = {
    booking_id: input.bookingId,
    booking_token: input.bookingToken,
    iat: now,
    exp,
    iss: TOKEN_ISSUER,
    aud: TOKEN_AUDIENCE,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const secret = getSecret();

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = sign(signingInput, secret);

  return `${signingInput}.${signature}`;
}

export function verifyBookingConfirmationToken(token: string): TokenResult {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return { success: false, error: "Token de confirmación inválido" };
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  try {
    const secret = getSecret();
    const expectedSignature = sign(signingInput, secret);

    const expectedBuffer = Buffer.from(expectedSignature);
    const actualBuffer = Buffer.from(encodedSignature);

    if (expectedBuffer.length !== actualBuffer.length) {
      return { success: false, error: "Token de confirmación inválido" };
    }

    if (!timingSafeEqual(expectedBuffer, actualBuffer)) {
      return { success: false, error: "Token de confirmación inválido" };
    }

    const payloadJson = fromBase64Url(encodedPayload).toString("utf-8");
    const parsedPayload = BookingConfirmationClaimsSchema.safeParse(
      JSON.parse(payloadJson),
    );

    if (!parsedPayload.success) {
      return { success: false, error: "Token de confirmación vencido o inválido" };
    }

    if (parsedPayload.data.exp < Math.floor(Date.now() / 1000)) {
      return { success: false, error: "Token de confirmación vencido o inválido" };
    }

    return {
      success: true,
      claims: parsedPayload.data,
    };
  } catch {
    return { success: false, error: "Token de confirmación inválido" };
  }
}
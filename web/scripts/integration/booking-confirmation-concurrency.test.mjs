import test from "node:test";
import assert from "node:assert/strict";

const API_BASE_URL = process.env.BOOKING_API_BASE_URL ?? "http://localhost:3000";
const BOOKING_TOKEN = process.env.BOOKING_CONCURRENCY_TOKEN;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

async function sendPatch(action) {
  const response = await fetch(
    `${API_BASE_URL}/api/booking?token=${encodeURIComponent(BOOKING_TOKEN)}`,
    {
      method: "PATCH",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ action }),
    },
  );

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return { status: response.status, payload };
}

test("PATCH /api/booking evita confirmaciones concurrentes con el mismo token", {
  skip: !BOOKING_TOKEN,
}, async () => {
  const [first, second] = await Promise.all([
    sendPatch("confirmed"),
    sendPatch("confirmed"),
  ]);

  const results = [first, second];
  const successCount = results.filter((result) => result.status === 200).length;
  assert.equal(successCount, 1, "solo una request debe confirmar la reserva");

  const conflictResult = results.find((result) => result.status === 409);
  assert.ok(conflictResult, "la segunda request debe fallar con conflicto");
  assert.equal(conflictResult.payload?.code, "BOOKING_NOT_UPDATABLE");
});
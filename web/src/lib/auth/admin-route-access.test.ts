import test from "node:test";
import assert from "node:assert/strict";
import { resolveAdminRouteRedirect } from "./admin-route-access.js";

test("admin puede acceder a rutas de administración", () => {
  const redirectPath = resolveAdminRouteRedirect({
    ok: true,
    userId: "user-admin",
    role: "admin",
    barberId: null,
  });

  assert.equal(redirectPath, null);
});

test("barbero es redirigido a /panel/barbero en rutas de administración", () => {
  const redirectPath = resolveAdminRouteRedirect({
    ok: true,
    userId: "user-barber",
    role: "barber",
    barberId: "barber-1",
  });

  assert.equal(redirectPath, "/panel/barbero");
});

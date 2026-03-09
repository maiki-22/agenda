import test from "node:test";
import assert from "node:assert/strict";
import {
  isProtectedPanelPath,
  shouldRedirectUnauthenticated,
} from "./lib/auth/panel-route-protection.js";

test("protege rutas de panel excepto /panel/login", () => {
  assert.equal(isProtectedPanelPath("/panel"), true);
  assert.equal(isProtectedPanelPath("/panel/admin"), true);
  assert.equal(isProtectedPanelPath("/panel/barbero"), true);
  assert.equal(isProtectedPanelPath("/panel/login"), false);
  assert.equal(isProtectedPanelPath("/"), false);
});

test("usuario anónimo se redirige en rutas protegidas", () => {
  assert.equal(shouldRedirectUnauthenticated("/panel/admin", false), true);
  assert.equal(shouldRedirectUnauthenticated("/panel/barbero", false), true);
});

test("usuario autenticado (barber/admin) no se redirige en rutas protegidas", () => {
  assert.equal(shouldRedirectUnauthenticated("/panel/admin", true), false);
  assert.equal(shouldRedirectUnauthenticated("/panel/barbero", true), false);
});

test("/panel/login se mantiene público aunque no haya sesión", () => {
  assert.equal(shouldRedirectUnauthenticated("/panel/login", false), false);
});
import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "grand_central_admin";
const SESSION_AGE_SECONDS = 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createAdminSession() {
  if (!secret()) throw new Error("ADMIN_PASSWORD and ADMIN_SESSION_SECRET must be configured.");
  const expires = Math.floor(Date.now() / 1000) + SESSION_AGE_SECONDS;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token || !secret()) return false;
  const [role, expiresText, signature] = token.split(".");
  if (role !== "admin" || !expiresText || !signature || Number(expiresText) < Date.now() / 1000) return false;
  const expected = sign(`${role}.${expiresText}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function validPassword(candidate: string) {
  const configured = process.env.ADMIN_PASSWORD || "";
  if (!configured || !candidate) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(configured);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function cookieOptions(maxAge = SESSION_AGE_SECONDS) {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge };
}

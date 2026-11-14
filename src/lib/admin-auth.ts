import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * مصادقة لوحة الإدارة — جلسة موقّعة بـ HMAC داخل كوكي.
 * كلمة المرور من متغير البيئة ADMIN_PASSWORD.
 */

const SECRET = process.env.ADMIN_SECRET || "falcon-idlib-secret-2024";
const PASSWORD = process.env.ADMIN_PASSWORD || "falcon-admin";
export const ADMIN_COOKIE = "falcon_admin";
const SESSION_DAYS = 7;

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_DAYS * 24 * 3600 * 1000;
  return `${expires}.${sign(String(expires))}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expiresStr, sig] = token.split(".");
  if (!expiresStr || !sig) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = sign(expiresStr);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkPassword(input: string): boolean {
  const a = Buffer.from(input ?? "", "utf8");
  const b = Buffer.from(PASSWORD, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** هل الزائر الحالي مسجّل كمدير؟ (لمكوّنات الخادم) */
export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

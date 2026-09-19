import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, issueSessionCookieValue, ADMIN_COOKIE_NAME } from "@/lib/venbrax-connect/admin-session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (typeof password !== "string" || !(await checkAdminPassword(password))) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, await issueSessionCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}

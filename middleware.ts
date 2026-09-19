import { NextRequest, NextResponse } from "next/server";
import { isValidSessionCookie, ADMIN_COOKIE_NAME } from "@/lib/venbrax-connect/admin-session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminArea = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (isAdminArea || isAdminApi) {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!(await isValidSessionCookie(cookie))) {
      if (isAdminApi) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Nur für Admin-Routen, außer für die Login-Seite
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.includes("/admin/login")) {
    const sessionCookie = request.cookies.get("admin_session")

    // Wenn kein Session-Cookie vorhanden ist, zur Login-Seite umleiten
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

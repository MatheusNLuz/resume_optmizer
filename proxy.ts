import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "atsforge-default-ultra-secure-key-32chars-minimum"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (e) {
      // Invalid token
    }
  }

  // Allow internal Puppeteer PDF export requests (no cookies available)
  if (pathname.includes("/preview") && request.nextUrl.searchParams.get("export") === "true") {
    return NextResponse.next();
  }

  const isProtectedRoute = 
    pathname === "/" ||
    pathname.startsWith("/analysis") || 
    pathname.startsWith("/history") || 
    pathname.startsWith("/settings");

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/analysis/:path*", 
    "/history/:path*", 
    "/settings/:path*",
    "/login",
    "/register"
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/infrastructure/supabase/client.middleware";

/**
 * Next.js Middleware
 * 
 * Runs on EVERY request before the page/API is processed.
 * 
 * Responsibilities:
 * 1. Session refresh (Supabase auth tokens)
 * 2. Admin route protection
 * 3. Security headers
 * 4. Redirects
 * 
 * Time Complexity: O(1) for header operations
 * Session refresh: O(1) API call (cached)
 */

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // 1. Supabase session refresh
  const supabase = createMiddlewareClient(request, response);
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Admin route protection
  if (pathname.startsWith("/admin")) {
    // Allow login page
    if (pathname === "/admin/login") {
      return response;
    }

    // Check if authenticated
    if (!session) {
      const redirectUrl = new URL("/admin/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 3. Security headers
  const securityHeaders = {
    "X-DNS-Prefetch-Control": "on",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: https: blob:`,
      `font-src 'self'`,
      `connect-src 'self' https://*.supabase.co wss://*.supabase.co`,
      `frame-src 'none'`,
      `object-src 'none'`,
    ].join("; "),
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Route matching
 * 
 * Exclude static files and Next.js internals from middleware.
 * Only run on page routes.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     * - API routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|api/).*)",
  ],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "./lib/ratelimit";

// Use console for Edge runtime compatibility (pino doesn't work in Edge)
const logger = {
  error: (ctx: object, msg: string) => console.error("[middleware]", msg, ctx),
  warn: (ctx: object, msg: string) => console.warn("[middleware]", msg, ctx),
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Protection for /admin
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("better-auth.session_token") ||
                         request.cookies.get("__Secure-better-auth.session_token");
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Note: Deep session validation (role check) happens in the Server Component 
    // for simplicity without an extra DB hit in middleware, but we ensure a session exists here.
  }

  // 2. Rate limiting for /api/auth and /api/fortunes
  // Skip rate limiting in MVP mode when Upstash is not configured
  const isMvpMode = process.env.MVP_MODE === "true";
  const hasUpstash = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  if ((pathname.startsWith("/api/auth") || pathname.startsWith("/api/fortunes")) && !isMvpMode && hasUpstash) {
    // Vercel / Common Proxy IP resolution
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]
      ?? request.headers.get("cf-connecting-ip")
      ?? request.headers.get("x-real-ip")
      ?? request.headers.get("x-forwarded-for")?.split(",")[0]
      ?? (process.env.NODE_ENV === "development" ? "127.0.0.1" : null);

    if (!ip) {
       logger.warn({ pathname }, "Request rejected: No IP address found");
       return new NextResponse(
         JSON.stringify({ error: "Service Unavailable: Missing Identity" }),
         { status: 503, headers: { "Content-Type": "application/json" } }
       );
    }

    try {
      const prefix = pathname.startsWith("/api/auth") ? "auth" : "fortunes";
      const { success, limit, remaining, reset } = await checkRateLimit(`${prefix}_${ip}`);

      if (!success) {
        logger.warn({ ip, pathname, limit, remaining }, "Rate limit exceeded");
        return new NextResponse(
          JSON.stringify({ error: "Too many requests" }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            }
          }
        );
      }
    } catch (error) {
      logger.error({ error, ip, pathname }, "Rate limit error");
      // Fail closed to prevent abuse when rate limiter is down
      return new NextResponse("Service Unavailable", { status: 503 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/fortunes/:path*",
    // Support exact matches as well
    "/api/fortunes",
    "/api/auth",
  ],
};
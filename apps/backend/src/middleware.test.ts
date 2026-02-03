import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock env BEFORE importing middleware
vi.mock("./env", () => ({
  env: {
    UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "test-token",
  }
}));

// Mock logger
vi.mock("./lib/logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }
}));

import { middleware } from "./middleware";
import { NextRequest, NextResponse } from "next/server";
import * as ratelimit from "./lib/ratelimit";

vi.mock("next/server", () => {
  class MockResponse {
    constructor(public body: any, public init: any) {}
    get status() { return this.init?.status || 200; }
    get headers() { return new Headers(this.init?.headers || {}); }
  }

  class MockNextResponse extends MockResponse {
    static next() { return new MockResponse(null, { status: 200 }); }
    static json(body: any, init: any) { return new MockResponse(JSON.stringify(body), init); }
  }

  return {
    NextRequest: vi.fn().mockImplementation((url, init) => ({
      nextUrl: new URL(url),
      headers: new Headers(init?.headers || {}),
    })),
    NextResponse: MockNextResponse,
  };
});

// Since Next.js NextResponse constructor in tests can be tricky, we'll just mock the whole thing
// but for now let's try to mock only the parts we need.
// Actually, it's better to mock the whole module for reliability in this environment.

vi.mock("./lib/ratelimit", () => ({
  checkRateLimit: vi.fn(),
}));

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow requests to non-rate-limited routes without rate limiting", async () => {
    const req = {
      nextUrl: { pathname: "/api/health" },
    } as any;
    
    const res = await middleware(req);
    expect(res.status).toBe(200);
    expect(ratelimit.checkRateLimit).not.toHaveBeenCalled();
  });

  it("should rate limit /api/auth routes", async () => {
    const req = {
      nextUrl: { pathname: "/api/auth/login" },
      headers: new Headers({ "x-forwarded-for": "1.2.3.4" }),
    } as any;
    
    (ratelimit.checkRateLimit as any).mockResolvedValue({
      success: true,
      limit: 20,
      remaining: 19,
      reset: Date.now(),
    });

    const res = await middleware(req);
    expect(ratelimit.checkRateLimit).toHaveBeenCalledWith("auth_1.2.3.4");
    expect(res.status).toBe(200);
  });

  it("should rate limit /api/fortunes base route", async () => {
    const req = {
      nextUrl: { pathname: "/api/fortunes" },
      headers: new Headers({ "x-forwarded-for": "1.2.3.4" }),
    } as any;
    
    (ratelimit.checkRateLimit as any).mockResolvedValue({
      success: true,
      limit: 20,
      remaining: 19,
      reset: Date.now(),
    });

    const res = await middleware(req);
    expect(ratelimit.checkRateLimit).toHaveBeenCalledWith("fortunes_1.2.3.4");
    expect(res.status).toBe(200);
  });

  it("should rate limit /api/fortunes/:id routes", async () => {
    const req = {
      nextUrl: { pathname: "/api/fortunes/123" },
      headers: new Headers({ "x-forwarded-for": "1.2.3.4" }),
    } as any;
    
    (ratelimit.checkRateLimit as any).mockResolvedValue({
      success: true,
      limit: 20,
      remaining: 19,
      reset: Date.now(),
    });

    const res = await middleware(req);
    expect(ratelimit.checkRateLimit).toHaveBeenCalledWith("fortunes_1.2.3.4");
    expect(res.status).toBe(200);
  });

  it("should return 503 when IP address is missing (Fail Closed)", async () => {
    const req = {
      nextUrl: { pathname: "/api/auth/login" },
      headers: new Headers({}), // Missing IP headers
    } as any;

    const res = await middleware(req);
    expect(res.status).toBe(503);
    const body = JSON.parse(res.body as unknown as string);
    expect(body.error).toContain("Service Unavailable");
  });

  it("should return 429 when rate limit is exceeded", async () => {
    const req = {
      nextUrl: { pathname: "/api/auth/login" },
      headers: new Headers({ "x-forwarded-for": "1.2.3.4" }),
    } as any;
    
    (ratelimit.checkRateLimit as any).mockResolvedValue({
      success: false,
      limit: 20,
      remaining: 0,
      reset: 123456789,
    });

    // We need to handle the mock of NextResponse constructor
    // In our middleware it uses new NextResponse(...)
    
    const res = await middleware(req);
    // Based on our implementation:
    // return new NextResponse(JSON.stringify({ error: "Too many requests" }), { status: 429, ... })
    // If our mock for NextResponse.next returns {status: 200}, then a 429 should be different.
    
    expect(res.status).toBe(429);
  });

  it("should return 503 when rate limiter throws (Fail Closed)", async () => {
    const req = {
      nextUrl: { pathname: "/api/auth/login" },
      headers: new Headers({ "x-forwarded-for": "1.2.3.4" }),
    } as any;
    
    (ratelimit.checkRateLimit as any).mockRejectedValue(new Error("Redis connection failed"));

    const res = await middleware(req);
    expect(res.status).toBe(503);
  });

  it("should handle concurrent requests correctly", async () => {
    const req = {
      nextUrl: { pathname: "/api/auth/login" },
      headers: new Headers({ "x-forwarded-for": "1.2.3.4" }),
    } as any;

    (ratelimit.checkRateLimit as any).mockResolvedValue({
      success: true,
      limit: 20,
      remaining: 19,
      reset: Date.now(),
    });

    const requests = Array(10).fill(req).map(() => middleware(req));
    await Promise.all(requests);

    expect(ratelimit.checkRateLimit).toHaveBeenCalledTimes(10);
  });
});

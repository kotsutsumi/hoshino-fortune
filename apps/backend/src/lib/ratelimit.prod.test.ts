import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We want to test the behavior when UPSTASH envs are missing
vi.mock("../env", () => ({
  env: {
    UPSTASH_REDIS_REST_URL: undefined,
    UPSTASH_REDIS_REST_TOKEN: undefined,
  },
}));

// Mock logger to avoid console noise
vi.mock("./logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ratelimit (Production Fallback)", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetModules();
    process.env.NODE_ENV = "production";
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv || "test";
    vi.clearAllMocks();
  });

  it("should throw in production when Upstash not configured", async () => {
    // We already mocked ../env to have undefined Upstash keys at the top of file
    const { ratelimit } = await import("./ratelimit");
    
    // We need to ensure the module re-evaluates the environment check
    await expect(ratelimit.limit("test")).rejects.toThrow("Rate limiting configuration missing");
  });

  it("does not enforce rate limits in development", async () => {
    process.env.NODE_ENV = "development";
    // Must re-import to pick up new NODE_ENV
    const { ratelimit } = await import("./ratelimit");
    
    const result = await ratelimit.limit("test");
    expect(result.success).toBe(true);
  });
});

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
  const originalEnv = process.env;

  beforeEach(async () => {
    const { ratelimit } = await import("./ratelimit");
    ratelimit._reset();
    // vi.resetModules(); // Not supported in Bun test runner
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should throw in production when Upstash not configured", async () => {
    process.env.NODE_ENV = "production";
    
    // Import the module dynamically to ensure we get the fresh state (though top-level env mock is static)
    // The module logic for `ratelimit.limit` function is what we are testing.
    // Since we changed ratelimit to be lazy, importing it is fine.
    
    const { ratelimit } = await import("./ratelimit");
    
    await expect(ratelimit.limit("test")).rejects.toThrow("Rate limiting configuration missing");
  });

  it("should NOT throw in non-production (allow pass through)", async () => {
    process.env.NODE_ENV = "development";
    
    const { ratelimit } = await import("./ratelimit");
    
    const result = await ratelimit.limit("test");
    expect(result.success).toBe(true);
  });
});

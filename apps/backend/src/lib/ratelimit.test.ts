import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock environment variables
vi.mock("../env", () => ({
  env: {
    UPSTASH_REDIS_REST_URL: "https://mock-url",
    UPSTASH_REDIS_REST_TOKEN: "mock-token",
  },
}));

// Mock Upstash Redis
vi.mock("@upstash/redis", () => ({
  Redis: class MockRedis {
    constructor() {}
  },
}));

// Mock Upstash Ratelimit
const mockLimit = vi.fn();
vi.mock("@upstash/ratelimit", () => {
  return {
    Ratelimit: class MockRatelimit {
      static slidingWindow() {
        return {};
      }
      limit(id: string) {
        return mockLimit(id);
      }
    },
  };
});

describe("checkRateLimit", () => {
  beforeEach(() => {
    // vi.resetModules(); // Removed as it might not be supported/needed
    // Actually, Bun might fail on resetModules. 
    // If I use dynamic import, I might get a fresh module if the registry is cleared.
    // If resetModules fails, I'll rely on mockLimit.mockReset().
    mockLimit.mockReset();
  });
  
  // Helper to get the function dynamically
  async function getCheckRateLimit() {
    const mod = await import("./ratelimit");
    return mod.checkRateLimit;
  }

  it("should return success: true when within limit", async () => {
    mockLimit.mockResolvedValueOnce({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now(),
    });

    const checkRateLimit = await getCheckRateLimit();
    const result = await checkRateLimit("user-1");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(9);
    expect(mockLimit).toHaveBeenCalledWith("user-1");
  });

  it("should return success: false when limit exceeded", async () => {
    mockLimit.mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now(),
    });

    const checkRateLimit = await getCheckRateLimit();
    const result = await checkRateLimit("user-abuser");
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should simulate multiple calls correctly", async () => {
    mockLimit
      .mockResolvedValueOnce({ success: true, remaining: 2 })
      .mockResolvedValueOnce({ success: true, remaining: 1 })
      .mockResolvedValueOnce({ success: false, remaining: 0 });

    const checkRateLimit = await getCheckRateLimit();

    const r1 = await checkRateLimit("id");
    expect(r1.success).toBe(true);

    const r2 = await checkRateLimit("id");
    expect(r2.success).toBe(true);

    const r3 = await checkRateLimit("id");
    expect(r3.success).toBe(false);

    expect(mockLimit).toHaveBeenCalledTimes(3);
  });
});
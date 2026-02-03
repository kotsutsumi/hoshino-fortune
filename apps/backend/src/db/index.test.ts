import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchWithRetry } from "./index";

// Mock logger
const loggerErrorSpy = vi.fn();
const loggerWarnSpy = vi.fn();
vi.mock("../lib/logger", () => ({
  logger: {
    error: (...args: any[]) => loggerErrorSpy(...args),
    warn: (...args: any[]) => loggerWarnSpy(...args),
  },
}));

describe("fetchWithRetry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should succeed on first attempt", async () => {
    (global.fetch as any).mockResolvedValue(new Response("ok"));
    const response = await fetchWithRetry("http://example.com");
    expect(response.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should retry on failure and eventually succeed", async () => {
    (global.fetch as any)
      .mockRejectedValueOnce(new Error("Network Error"))
      .mockResolvedValueOnce(new Response("ok"));

    const response = await fetchWithRetry("http://example.com");
    expect(response.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
  });

  it("should fail after max retries and throw generic error", async () => {
    (global.fetch as any).mockRejectedValue(new Error("Network Error"));

    await expect(fetchWithRetry("http://example.com")).rejects.toThrow("Database connection failed");
    // Initial (0) -> catch (attempt=1) -> warn -> wait -> loop
    // Second (1) -> catch (attempt=2) -> warn -> wait -> loop
    // Third (2) -> catch (attempt=3) -> error -> throw
    expect(global.fetch).toHaveBeenCalledTimes(3); 
    expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("should abort on timeout", async () => {
    vi.useFakeTimers();
    
    // fetch that never resolves
    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    const fetchPromise = fetchWithRetry("http://example.com");
    
    // Advance time to trigger timeout
    await vi.advanceTimersByTimeAsync(11000); // TIMEOUT_MS is 10000
    
    // The first fetch attempt should have been aborted
    const fetchCall = (global.fetch as any).mock.calls.find((call: any) => 
      call[0].toString().includes("http://example.com")
    );
    expect(fetchCall).toBeDefined();
    const signal = fetchCall[1]?.signal;
    expect(signal).toBeDefined();
    expect(signal.aborted).toBe(true);

    vi.useRealTimers();
  });
});

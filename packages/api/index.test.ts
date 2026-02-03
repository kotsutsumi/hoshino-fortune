import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ApiError, handleResponse, fetchWithTimeout } from "./index";

// =============================================================================
// 🔥 CRITICAL: API Client Tests
// If these fail, all frontend-backend communication is broken
// =============================================================================

// Note: We test the pure parts (ApiError class) and mock-based tests for fetch
// Integration tests will cover real network calls

describe("ApiError", () => {
  // =========================================================================
  // 🔥 Error Construction - Proper error propagation is critical
  // =========================================================================
  describe("construction", () => {
    it("creates error with status and message", () => {
      const error = new ApiError(404, "Not Found");
      expect(error.status).toBe(404);
      expect(error.message).toBe("Not Found");
      expect(error.name).toBe("ApiError");
    });

    it("includes optional data payload", () => {
      const errorData = { field: "email", reason: "invalid format" };
      const error = new ApiError(400, "Validation Error", errorData);
      expect(error.data).toEqual(errorData);
    });

    it("extends Error properly (instanceof works)", () => {
      const error = new ApiError(500, "Server Error");
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
    });

    it("has proper stack trace", () => {
      const error = new ApiError(500, "Server Error");
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("ApiError");
    });
  });

  // =========================================================================
  // 🔥 Status Code Categories - Used for error handling decisions
  // =========================================================================
  describe("status code handling", () => {
    it("represents 4xx client errors", () => {
      const badRequest = new ApiError(400, "Bad Request");
      const unauthorized = new ApiError(401, "Unauthorized");
      const forbidden = new ApiError(403, "Forbidden");
      const notFound = new ApiError(404, "Not Found");
      const conflict = new ApiError(409, "Conflict");
      const unprocessable = new ApiError(422, "Unprocessable Entity");

      expect(badRequest.status).toBe(400);
      expect(unauthorized.status).toBe(401);
      expect(forbidden.status).toBe(403);
      expect(notFound.status).toBe(404);
      expect(conflict.status).toBe(409);
      expect(unprocessable.status).toBe(422);
    });

    it("represents 5xx server errors", () => {
      const serverError = new ApiError(500, "Internal Server Error");
      const badGateway = new ApiError(502, "Bad Gateway");
      const unavailable = new ApiError(503, "Service Unavailable");
      const timeout = new ApiError(504, "Gateway Timeout");

      expect(serverError.status).toBe(500);
      expect(badGateway.status).toBe(502);
      expect(unavailable.status).toBe(503);
      expect(timeout.status).toBe(504);
    });
  });

  // =========================================================================
  // ⚠️ Data Field - Optional additional context
  // =========================================================================
  describe("data field", () => {
    it("undefined when not provided", () => {
      const error = new ApiError(404, "Not Found");
      expect(error.data).toBeUndefined();
    });

    it("preserves complex data structures", () => {
      const complexData = {
        errors: [
          { field: "email", message: "required" },
          { field: "password", message: "too short" },
        ],
        meta: { requestId: "abc123" },
      };
      const error = new ApiError(400, "Validation Failed", complexData);
      expect(error.data).toEqual(complexData);
    });

    it("preserves null data (different from undefined)", () => {
      const error = new ApiError(400, "Bad Request", null);
      expect(error.data).toBeNull();
    });
  });
});

// =============================================================================
// 🔥 handleResponse Tests (with mocked fetch)
// =============================================================================
describe("handleResponse behavior", () => {
  // We test the behavior by creating mock Response objects
  // This is a unit test - integration tests will use real HTTP

  const createMockResponse = (
    status: number,
    body: unknown,
    ok: boolean = status >= 200 && status < 300
  ): Response => {
    return {
      ok,
      status,
      statusText: status === 200 ? "OK" : status === 404 ? "Not Found" : "Error",
      json: () => Promise.resolve(body),
      headers: new Headers(),
      redirected: false,
      type: "basic" as ResponseType,
      url: "",
      clone: () => createMockResponse(status, body, ok),
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      bytes: () => Promise.resolve(new Uint8Array()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve(JSON.stringify(body)),
    } as Response;
  };

  // =========================================================================
  // 🔥 Success Responses (2xx)
  // =========================================================================
  describe("success responses", () => {
    it("parses JSON body on 200 OK", async () => {
      const data = { id: "123", name: "Test" };
      const response = createMockResponse(200, data);
      const result = await handleResponse(response);
      expect(result).toEqual(data);
    });

    it("parses array response", async () => {
      const data = [{ id: "1" }, { id: "2" }];
      const response = createMockResponse(200, data);
      const result = await handleResponse(response);
      expect(result).toEqual(data);
    });

    it("parses empty object", async () => {
      const response = createMockResponse(200, {});
      const result = await handleResponse(response);
      expect(result).toEqual({});
    });

    it("parses null body", async () => {
      const response = createMockResponse(200, null);
      const result = await handleResponse(response);
      expect(result).toBeNull();
    });
  });

  // =========================================================================
  // 🔥 Error Responses (4xx, 5xx)
  // =========================================================================
  describe("error responses", () => {
    it("throws ApiError on 400 Bad Request", async () => {
      const errorBody = { message: "Invalid input", code: "INVALID" };
      const response = createMockResponse(400, errorBody, false);

      await expect(handleResponse(response)).rejects.toThrow(ApiError);
      await expect(handleResponse(response)).rejects.toMatchObject({
        status: 400,
        message: "Invalid input",
        data: errorBody,
      });
    });

    it("throws ApiError on 401 Unauthorized", async () => {
      const errorBody = { message: "Authentication required" };
      const response = createMockResponse(401, errorBody, false);

      await expect(handleResponse(response)).rejects.toMatchObject({
        status: 401,
        message: "Authentication required",
      });
    });

    it("throws ApiError on 403 Forbidden", async () => {
      const errorBody = { message: "Access denied" };
      const response = createMockResponse(403, errorBody, false);

      await expect(handleResponse(response)).rejects.toMatchObject({
        status: 403,
        message: "Access denied",
      });
    });

    it("throws ApiError on 404 Not Found", async () => {
      const errorBody = { message: "Resource not found" };
      const response = createMockResponse(404, errorBody, false);

      await expect(handleResponse(response)).rejects.toMatchObject({
        status: 404,
        message: "Resource not found",
      });
    });

    it("throws ApiError on 500 Server Error", async () => {
      const errorBody = { message: "Internal server error" };
      const response = createMockResponse(500, errorBody, false);

      await expect(handleResponse(response)).rejects.toMatchObject({
        status: 500,
        message: "Internal server error",
      });
    });
  });

  // =========================================================================
  // 🔥 Fallback Error Handling - When JSON parsing fails
  // =========================================================================
  describe("fallback error handling", () => {
    it("falls back to statusText when JSON body is invalid", async () => {
      const response = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.reject(new Error("Invalid JSON")),
        headers: new Headers(),
        redirected: false,
        type: "basic" as ResponseType,
        url: "",
        clone: () => response,
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        bytes: () => Promise.resolve(new Uint8Array()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve("not json"),
      } as Response;

      await expect(handleResponse(response)).rejects.toMatchObject({
        status: 500,
        message: "Internal Server Error",
      });
    });

    it("uses statusText when error body has no message", async () => {
      const errorBody = { code: "UNKNOWN", details: "something went wrong" };
      const response = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.resolve(errorBody),
        headers: new Headers(),
        redirected: false,
        type: "basic" as ResponseType,
        url: "",
        clone: () => response,
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        bytes: () => Promise.resolve(new Uint8Array()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve(JSON.stringify(errorBody)),
      } as Response;

      await expect(handleResponse(response)).rejects.toMatchObject({
        status: 404,
        message: "Not Found", // Falls back to statusText
        data: errorBody,
      });
    });
  });
});

// =============================================================================
// 🔥 fetchWithTimeout Tests
// Note: Fake timer tests with AbortController are flaky
// These test the contract, not the implementation
// =============================================================================
describe("fetchWithTimeout behavior", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // =========================================================================
  // 🔥 Request Options Forwarding - Critical for API calls
  // =========================================================================
  describe("request options", () => {
    it("forwards method and headers", async () => {
      const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await fetchWithTimeout("https://api.example.com/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: "test" }),
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: "test" }),
        })
      );
    });

    it("includes abort signal in fetch options", async () => {
      const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await fetchWithTimeout("https://api.example.com/test");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it("completes successfully when fetch resolves", async () => {
      const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await fetchWithTimeout("https://api.example.com/test");

      expect(result).toBe(mockResponse);
    });

    it("propagates fetch errors", async () => {
      const networkError = new Error("Network failure");
      global.fetch = vi.fn().mockRejectedValue(networkError);

      await expect(fetchWithTimeout("https://api.example.com/test")).rejects.toThrow(
        "Network failure"
      );
    });

    it("aborts when timeout is reached", async () => {
      vi.useFakeTimers();
      
      // Create a fetch that never resolves until we want it to
      global.fetch = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          // This will be called when aborted
        });
      });

      const fetchPromise = fetchWithTimeout("https://api.example.com/test", { timeout: 100 });
      
      // Advance time
      vi.advanceTimersByTime(150);
      
      // The promise should be rejected with an AbortError (or whatever the mock returns)
      // In a real browser/node, it throws "AbortError"
      // Since we are mocking, we check if signal.aborted is true
      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      const signal = fetchCall[1].signal;
      
      expect(signal.aborted).toBe(true);
      
      vi.useRealTimers();
    });
  });
});

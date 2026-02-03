import { test, expect } from "@playwright/test";

/**
 * 🔥 CRITICAL: Fortune API Integration Tests
 *
 * These tests verify:
 * 1. API endpoints return correct data structure
 * 2. Public/private content filtering works
 * 3. Error handling returns proper status codes
 *
 * If these fail: Core business logic is broken
 */

test.describe("GET /api/fortunes", () => {
  test("should return 200 and array of fortunes", async ({ request }) => {
    const response = await request.get("/api/fortunes");

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("should return proper fortune structure when fortunes exist", async ({
    request,
  }) => {
    const response = await request.get("/api/fortunes");
    expect(response.ok()).toBe(true);

    const data = await response.json();

    // Verify structure IF fortunes exist
    if (data.length > 0) {
      const fortune = data[0];
      expect(fortune).toHaveProperty("id");
      expect(fortune).toHaveProperty("title");
      expect(fortune).toHaveProperty("type");
      expect(fortune).toHaveProperty("price");
      expect(fortune).toHaveProperty("isPublic");
      expect(fortune).toHaveProperty("tellerId");

      // All returned fortunes should be public
      for (const f of data) {
        expect(f.isPublic).toBe(true);
      }
    }
  });

  test("should return JSON content type", async ({ request }) => {
    const response = await request.get("/api/fortunes");

    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  });
});

test.describe("GET /api/fortunes/:id", () => {
  test("should return 404 for non-existent fortune", async ({ request }) => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const response = await request.get(`/api/fortunes/${fakeId}`);

    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data).toHaveProperty("error");
  });

  test("should return 400 for invalid UUID format", async ({ request }) => {
    const response = await request.get("/api/fortunes/invalid-id");

    // Invalid UUID should be 400 Bad Request
    expect(response.status()).toBe(400);
  });

  test("should return proper fortune structure for existing public fortune", async ({
    request,
  }) => {
    // First get a list to find a valid ID
    const listResponse = await request.get("/api/fortunes");
    const fortunes = await listResponse.json();

    const validId = fortunes.length > 0 ? fortunes[0].id : "22222222-2222-2222-2222-222222222222"; // Fallback to seeded ID

    const response = await request.get(`/api/fortunes/${validId}`);

    expect(response.status()).toBe(200);

    const fortune = await response.json();
    expect(fortune.id).toBe(validId);
    expect(fortune).toHaveProperty("title");
    expect(fortune).toHaveProperty("type");
    expect(fortune).toHaveProperty("price");
    expect(fortune.isPublic).toBe(true);
  });

  test("should return JSON content type", async ({ request }) => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const response = await request.get(`/api/fortunes/${fakeId}`);

    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  });
});

test.describe("API Error Handling", () => {
  test("should return proper error format on 404", async ({ request }) => {
    const response = await request.get(
      "/api/fortunes/00000000-0000-0000-0000-000000000000"
    );

    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data).toMatchObject({
      error: expect.any(String),
    });
  });

  test("should handle malformed requests gracefully", async ({ request }) => {
    // Request with special characters
    const response = await request.get("/api/fortunes/<script>alert(1)</script>");

    // Should not return 500
    expect(response.status()).not.toBe(500);
    // Should return error status
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

import { test, expect } from "@playwright/test";

/**
 * 🔥 CRITICAL: Purchase Flow Integration Tests
 *
 * These tests verify the purchase initiation:
 * 1. Authenticate
 * 2. List Fortunes
 * 3. Initiate Checkout
 *
 * If this fails: No revenue.
 */

test.describe.serial("Purchase Flow", () => {
  const timestamp = Date.now();
  const testUser = {
    email: `buyer_${timestamp}@example.com`,
    password: "Password123!",
    name: "Buyer User",
  };

  let authCookieHeader = "";

  test.beforeAll(async ({ request }) => {
    // Sign up
    const response = await request.post("/api/auth/sign-up/email", {
      data: {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      },
    });
    expect(response.status()).toBe(200);
    const headers = response.headers();
    if (headers["set-cookie"]) {
        authCookieHeader = headers["set-cookie"];
    }
  });

  test("should be able to list fortunes", async ({ request }) => {
    const headers = authCookieHeader ? { "Cookie": authCookieHeader } : undefined;
    const response = await request.get("/api/fortunes", { headers });
    expect(response.status()).toBe(200);
    const fortunes = await response.json();
    expect(Array.isArray(fortunes)).toBe(true);
    expect(fortunes.length).toBeGreaterThan(0);
  });

  test("should be able to initiate checkout for a fortune", async ({ request }) => {
    const headers = authCookieHeader ? { "Cookie": authCookieHeader } : undefined;
    
    // Get a fortune first
    const listRes = await request.get("/api/fortunes", { headers });
    const fortunes = await listRes.json();
    const fortune = fortunes[0];
    
    expect(fortune).toBeDefined();
    expect(fortune.id).toBeDefined();

    // Initiate checkout
    const checkoutRes = await request.post(`/api/fortunes/${fortune.id}/checkout`, {
        headers
    });
    
    expect(checkoutRes.status()).toBe(200);
    const data = await checkoutRes.json();
    
    expect(data).toHaveProperty("url");
    expect(data).toHaveProperty("sessionId");
    expect(data.url).toContain("stripe.com");
  });

  test("should fail checkout if not logged in", async ({ request }) => {
    // Get a fortune (publicly accessible list?)
    // Assuming list is public or we used auth to get ID but then try checkout without auth
    const listRes = await request.get("/api/fortunes"); // Assuming list might be public?
    // If list is private, we can't even get ID. But let's assume we have an ID or use the one from previous test if we shared state.
    // Let's rely on flow.
    
    // Actually, let's just use a fake ID for 401 check, or try to list.
    // If /api/fortunes requires auth, we get 401.
    
    const checkoutRes = await request.post(`/api/fortunes/some-fake-id/checkout`);
    expect(checkoutRes.status()).toBe(401);
  });
});

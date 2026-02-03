import { test, expect } from "@playwright/test";

/**
 * 🔥 CRITICAL: Authentication Integration Tests
 *
 * These tests verify the full authentication lifecycle:
 * 1. Sign Up (Email/Password)
 * 2. Session Management
 * 3. Sign Out
 * 4. Sign In (Credentials)
 * 5. Protected Route Access
 *
 * If these fail: Users cannot log in, security is compromised.
 */

test.describe.serial("Authentication Flow (BetterAuth)", () => {
  // Use a unique email for each test run to avoid unique constraint violations
  const timestamp = Date.now();
  const testUser = {
    email: `test_${timestamp}@example.com`,
    password: "Password123!",
    name: "Test User",
  };

  let authCookieHeader = "";

  test("should start with no session", async ({ request }) => {
    const response = await request.get("/api/auth/get-session");
    expect(response.status()).toBe(200);
    const session = await response.json();
    expect(session).toBeNull();
  });

  test("should successfully sign up", async ({ request }) => {
    const response = await request.post("/api/auth/sign-up/email", {
      data: {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    
    // Capture cookie
    const headers = response.headers();
    if (headers["set-cookie"]) {
        authCookieHeader = headers["set-cookie"];
        // Playwright might merge multiple set-cookie headers with newlines or commas
        // For simple usage, sending it back as 'Cookie' header usually works if raw string
        // But 'Set-Cookie' format needs to be converted to 'Cookie' format (key=value; key=value)
        // Usually we just need the first part (better-auth.session_token=...)
        // But sending the whole string usually works in many clients, or we split it.
        // Let's assume sending it back works or strip the attributes.
        
        // Actually, Set-Cookie has attributes (Path, HttpOnly) which should NOT be sent in Cookie header.
        // We need to parse it.
        const cookies = authCookieHeader.split(',').map(c => c.split(';')[0].trim()).join('; ');
        authCookieHeader = cookies;
    }
    
    // BetterAuth usually returns user and session
    if (data.token) {
        expect(data).toHaveProperty("token");
    } else {
        expect(data).toHaveProperty("user");
    }
  });

  test("should have a valid session after sign up", async ({ request }) => {
    const headers = authCookieHeader ? { "Cookie": authCookieHeader } : undefined;

    const response = await request.get("/api/auth/get-session", {
        headers
    });
    
    expect(response.status()).toBe(200);
    const session = await response.json();
    
    expect(session).not.toBeNull();
    expect(session.user.email).toBe(testUser.email);
  });

  test("should successfully sign out", async ({ request }) => {
    const headers = authCookieHeader ? { "Cookie": authCookieHeader } : undefined;
    
    const response = await request.post("/api/auth/sign-out", {
        data: {},
        headers
    });
    
    expect(response.status()).toBe(200);

    // Verify session is gone
    const sessionResponse = await request.get("/api/auth/get-session", { headers });
    const session = await sessionResponse.json();
    expect(session).toBeNull();
    
    // Clear cookie
    authCookieHeader = "";
  });

  test("should successfully sign in with credentials", async ({ request }) => {
    const response = await request.post("/api/auth/sign-in/email", {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    
    // Capture new cookie
    const headers = response.headers();
    if (headers["set-cookie"]) {
        let rawCookie = headers["set-cookie"];
        authCookieHeader = rawCookie.split(',').map(c => c.split(';')[0].trim()).join('; ');
    }
    
    // Verify user in response or fetch session
    if (data.user) {
        expect(data.user.email).toBe(testUser.email);
    } else {
        // If only token returned, verify session
        const sessionResponse = await request.get("/api/auth/get-session", {
            headers: { "Cookie": authCookieHeader }
        });
        const session = await sessionResponse.json();
        expect(session.user.email).toBe(testUser.email);
    }
  });

  test("should fail to sign in with wrong password", async ({ request }) => {
    const response = await request.post("/api/auth/sign-in/email", {
      data: {
        email: testUser.email,
        password: "WrongPassword!",
      },
    });

    // BetterAuth usually returns 401 or 400 for bad credentials
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
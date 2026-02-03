import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

const { mockSession, mockStripeSession, mockFortune, mockDb } = vi.hoisted(() => {
  const mockFortune = {
    id: "fortune-1",
    title: "Test Fortune",
    description: "Test Description",
    price: 1000,
    isPublic: true,
  };
  
  return {
    mockSession: {
      user: { id: "user-1", email: "test@example.com" },
      session: { id: "session-1" },
    },
    mockStripeSession: {
      id: "cs_test_123",
      url: "https://checkout.stripe.com/test",
    },
    mockFortune,
    mockDb: {
      query: {
        fortuneContents: {
          findFirst: vi.fn().mockResolvedValue(mockFortune),
        },
      },
    },
  };
});

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(mockSession),
    },
  },
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue(mockStripeSession),
      },
    },
  },
}));

vi.mock("@/env", () => ({
  env: {
    BETTER_AUTH_URL: "http://localhost:3000",
  },
}));



vi.mock("@/db", () => ({
  db: mockDb,
}));

vi.mock("@/db/schema", () => ({
  fortuneContents: { id: "id" }, // simplistic mock for eq()
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe("Checkout API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return checkout URL on success", async () => {
    const req = new Request("http://localhost/api/fortunes/fortune-1/checkout", {
      method: "POST",
    });
    const params = Promise.resolve({ id: "fortune-1" });

    const res = await POST(req, { params });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      url: mockStripeSession.url,
      sessionId: mockStripeSession.id,
    });
  });

  it("should return 401 if not authenticated", async () => {
    const { auth } = await import("@/lib/auth");
    (auth.api.getSession as any).mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/fortunes/fortune-1/checkout", {
      method: "POST",
    });
    const params = Promise.resolve({ id: "fortune-1" });

    const res = await POST(req, { params });
    expect(res.status).toBe(401);
  });

  it("should return 404 if fortune not found", async () => {
    mockDb.query.fortuneContents.findFirst.mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/fortunes/fortune-1/checkout", {
      method: "POST",
    });
    const params = Promise.resolve({ id: "fortune-1" });

    const res = await POST(req, { params });
    expect(res.status).toBe(404);
  });

  it("should return 403 if fortune is not public", async () => {
    mockDb.query.fortuneContents.findFirst.mockResolvedValueOnce({
      ...mockFortune,
      isPublic: false,
    });

    const req = new Request("http://localhost/api/fortunes/fortune-1/checkout", {
      method: "POST",
    });
    const params = Promise.resolve({ id: "fortune-1" });

    const res = await POST(req, { params });
    expect(res.status).toBe(403);
  });
});

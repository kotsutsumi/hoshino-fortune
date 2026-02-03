import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { stripe } from "@/lib/stripe";
import { env } from "@/env";

// Mock dependencies
vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}));

vi.mock("@/env", () => ({
  env: {
    STRIPE_WEBHOOK_SECRET: "whsec_test_secret",
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn().mockImplementation(async () => ({
    get: (key: string) => {
      if (key === "stripe-signature") return "test_signature";
      return null;
    },
  })),
}));

// Mock DB
const mockDb = {
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
};

vi.mock("@/db", () => ({
  db: mockDb,
}));

vi.mock("@/db/schema", () => ({
  purchases: { stripeSessionId: "stripeSessionId" },
}));

describe("Stripe Webhook API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.onConflictDoNothing.mockResolvedValue(undefined); // Reset default behavior
  });

  it("should return 400 if signature is missing", async () => {
    const { headers } = await import("next/headers");
    (headers as any).mockImplementationOnce(async () => ({
      get: () => null,
    }));

    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify({ id: "evt_123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing signature");
  });

  it("should return 400 if signature verification fails", async () => {
    (stripe.webhooks.constructEvent as any).mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify({ id: "evt_123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Webhook Error: Invalid signature");
  });

  it("should return 200 and process event if signature is valid", async () => {
    const mockEvent = {
      type: "checkout.session.completed",
      data: {
        object: { 
          id: "cs_123",
          metadata: { 
            userId: "00000000-0000-0000-0000-000000000001", 
            fortuneId: "00000000-0000-0000-0000-000000000002" 
          }
        },
      },
    };
    (stripe.webhooks.constructEvent as any).mockReturnValue(mockEvent);

    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify(mockEvent),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);
    expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
      JSON.stringify(mockEvent),
      "test_signature",
      "whsec_test_secret"
    );
  });

  it("should return 400 if metadata is invalid", async () => {
    const mockEvent = {
      type: "checkout.session.completed",
      data: {
        object: { 
          id: "cs_123",
          metadata: { userId: "invalid", fortuneId: "invalid" }
        },
      },
    };
    (stripe.webhooks.constructEvent as any).mockReturnValue(mockEvent);

    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify(mockEvent),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid metadata");
  });

  it("should return 500 if database insert fails", async () => {
    const mockEvent = {
      type: "checkout.session.completed",
      data: {
        object: { 
          id: "cs_123",
          metadata: { 
            userId: "00000000-0000-0000-0000-000000000001", 
            fortuneId: "00000000-0000-0000-0000-000000000002" 
          }
        },
      },
    };
    (stripe.webhooks.constructEvent as any).mockReturnValue(mockEvent);
    
    mockDb.onConflictDoNothing.mockRejectedValueOnce(new Error("DB Error"));

    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify(mockEvent),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Database error");
  });

  it("should be idempotent (handle duplicate events)", async () => {
    const mockEvent = {
      type: "checkout.session.completed",
      data: {
        object: { 
          id: "cs_123",
          metadata: { 
            userId: "00000000-0000-0000-0000-000000000001", 
            fortuneId: "00000000-0000-0000-0000-000000000002" 
          }
        },
      },
    };
    (stripe.webhooks.constructEvent as any).mockReturnValue(mockEvent);

    // First call
    await POST(new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify(mockEvent),
    }));

    // Second call - simulates duplicate
    const res = await POST(new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify(mockEvent),
    }));

    expect(res.status).toBe(200);
    expect(mockDb.onConflictDoNothing).toHaveBeenCalledTimes(2);
  });
});
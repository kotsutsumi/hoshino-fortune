import { describe, it, expect } from "vitest";
import {
  UserSchema,
  UserStatusSchema,
  UserRoleSchema,
  FortuneContentSchema,
} from "./index";

// =============================================================================
// 🔥 CRITICAL: Domain Schema Tests
// If these fail, data corruption or security breaches are possible
// =============================================================================

describe("UserStatusSchema", () => {
  it("accepts 'active' status", () => {
    expect(UserStatusSchema.parse("active")).toBe("active");
  });

  it("accepts 'suspended' status", () => {
    expect(UserStatusSchema.parse("suspended")).toBe("suspended");
  });

  it("rejects invalid status - prevents privilege escalation", () => {
    const result = UserStatusSchema.safeParse("admin");
    expect(result.success).toBe(false);
  });

  it("rejects empty string - prevents null-like bypass", () => {
    const result = UserStatusSchema.safeParse("");
    expect(result.success).toBe(false);
  });

  it("rejects number type coercion attack", () => {
    const result = UserStatusSchema.safeParse(0);
    expect(result.success).toBe(false);
  });
});

describe("UserRoleSchema", () => {
  it("accepts 'user' role", () => {
    expect(UserRoleSchema.parse("user")).toBe("user");
  });

  it("accepts 'admin' role", () => {
    expect(UserRoleSchema.parse("admin")).toBe("admin");
  });

  it("rejects invalid role - prevents privilege escalation", () => {
    const result = UserRoleSchema.safeParse("superadmin");
    expect(result.success).toBe(false);
  });

  it("rejects empty string", () => {
    const result = UserRoleSchema.safeParse("");
    expect(result.success).toBe(false);
  });
});

describe("UserSchema", () => {
  const validUser = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    email: "test@example.com",
    lineUserId: null,
    name: null,
    emailVerified: false,
    image: null,
    birthDate: null,
    gender: null,
    role: "user",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // =========================================================================
  // 🔥 ID Validation - Non-empty string required
  // =========================================================================
  describe("id field", () => {
    it("accepts valid UUID v4", () => {
      const result = UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("accepts non-UUID string (relaxed for DB compatibility)", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        id: "not-a-uuid",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty string - prevents ghost records", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        id: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects SQL injection attempt in ID", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        id: "'; DROP TABLE users; --",
      });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // 🔥 Email Validation - Primary authentication identifier
  // =========================================================================
  describe("email field", () => {
    it("accepts valid email format", () => {
      const result = UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("rejects missing @ symbol", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        email: "testexample.com",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing domain", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        email: "test@",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty string - prevents anonymous accounts", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        email: "",
      });
      expect(result.success).toBe(false);
    });

    it("accepts email with subdomain", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        email: "user@mail.example.co.jp",
      });
      expect(result.success).toBe(true);
    });

    it("accepts email with plus addressing", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        email: "user+tag@example.com",
      });
      expect(result.success).toBe(true);
    });
  });

  // =========================================================================
  // ⚠️ Nullable Fields - Must handle null correctly
  // =========================================================================
  describe("nullable fields", () => {
    it("accepts all nulls for optional profile fields", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        lineUserId: null,
        name: null,
        birthDate: null,
        gender: null,
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid lineUserId when present", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        lineUserId: "U1234567890abcdef1234567890abcdef",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid name when present", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        name: "田中太郎",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid birthDate as Date object", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        birthDate: new Date("1990-01-15"),
      });
      expect(result.success).toBe(true);
    });

    it("accepts birthDate as ISO string (coerces to Date)", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        birthDate: "1990-01-15T00:00:00.000Z",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.birthDate).toBeInstanceOf(Date);
      }
    });
  });

  // =========================================================================
  // 🔥 Date Fields - Must coerce from JSON strings
  // =========================================================================
  describe("date coercion", () => {
    it("coerces createdAt from ISO string - critical for API responses", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        createdAt: "2024-01-15T10:30:00.000Z",
        updatedAt: "2024-01-15T10:30:00.000Z",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.createdAt).toBeInstanceOf(Date);
        expect(result.data.updatedAt).toBeInstanceOf(Date);
      }
    });

    it("rejects invalid date string", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        createdAt: "not-a-date",
      });
      expect(result.success).toBe(false);
    });

    it("accepts Unix timestamp (coerces to Date)", () => {
      const result = UserSchema.safeParse({
        ...validUser,
        createdAt: 1705315800000,
        updatedAt: 1705315800000,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.createdAt).toBeInstanceOf(Date);
      }
    });
  });

  // =========================================================================
  // 🔥 Required Fields - Missing fields must fail
  // =========================================================================
  describe("required fields", () => {
    it("rejects missing id", () => {
      const { id, ...noId } = validUser;
      const result = UserSchema.safeParse(noId);
      expect(result.success).toBe(false);
    });

    it("rejects missing email", () => {
      const { email, ...noEmail } = validUser;
      const result = UserSchema.safeParse(noEmail);
      expect(result.success).toBe(false);
    });

    it("rejects missing status", () => {
      const { status, ...noStatus } = validUser;
      const result = UserSchema.safeParse(noStatus);
      expect(result.success).toBe(false);
    });

    it("rejects missing role", () => {
      const { role, ...noRole } = validUser;
      const result = UserSchema.safeParse(noRole);
      expect(result.success).toBe(false);
    });

    it("rejects missing createdAt", () => {
      const { createdAt, ...noCreatedAt } = validUser;
      const result = UserSchema.safeParse(noCreatedAt);
      expect(result.success).toBe(false);
    });

    it("rejects missing updatedAt", () => {
      const { updatedAt, ...noUpdatedAt } = validUser;
      const result = UserSchema.safeParse(noUpdatedAt);
      expect(result.success).toBe(false);
    });
  });
});

describe("FortuneContentSchema", () => {
  const validFortune = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "今日の運勢",
    description: "あなたの今日の運勢をお伝えします",
    type: "tarot",
    price: 500,
    isPublic: true,
    tellerId: "987fcdeb-51a2-3d4e-b678-426614174999",
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // =========================================================================
  // 🔥 Price Validation - Prevents financial fraud
  // =========================================================================
  describe("price field", () => {
    it("accepts zero price (free content)", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        price: 0,
      });
      expect(result.success).toBe(true);
    });

    it("accepts positive integer price", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        price: 10000,
      });
      expect(result.success).toBe(true);
    });

    it("rejects negative price - prevents refund fraud", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        price: -100,
      });
      expect(result.success).toBe(false);
    });

    it("rejects float price - currency must be integer (JPY)", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        price: 99.99,
      });
      expect(result.success).toBe(false);
    });

    it("rejects string price - type safety", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        price: "500",
      });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // 🔥 ID Validation - UUIDs for both content and teller
  // =========================================================================
  describe("UUID fields", () => {
    it("accepts valid UUIDs", () => {
      const result = FortuneContentSchema.safeParse(validFortune);
      expect(result.success).toBe(true);
    });

    it("rejects invalid content ID", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        id: "invalid-id",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid teller ID", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        tellerId: "invalid-teller",
      });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // 🔥 isPublic - Controls content visibility
  // =========================================================================
  describe("isPublic field", () => {
    it("accepts true (public content)", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        isPublic: true,
      });
      expect(result.success).toBe(true);
    });

    it("accepts false (private content)", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        isPublic: false,
      });
      expect(result.success).toBe(true);
    });

    it("rejects string 'true' - no type coercion", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        isPublic: "true",
      });
      expect(result.success).toBe(false);
    });

    it("rejects number 1 - strict boolean only", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        isPublic: 1,
      });
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // ⚠️ publishedAt - Controls when content becomes visible
  // =========================================================================
  describe("publishedAt field", () => {
    it("accepts null (unpublished draft)", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        publishedAt: null,
      });
      expect(result.success).toBe(true);
    });

    it("accepts Date object", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        publishedAt: new Date("2024-01-15"),
      });
      expect(result.success).toBe(true);
    });

    it("coerces ISO string to Date - API response handling", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        publishedAt: "2024-01-15T10:30:00.000Z",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.publishedAt).toBeInstanceOf(Date);
      }
    });
  });

  // =========================================================================
  // 🔥 Required Fields - Missing fields must fail
  // =========================================================================
  describe("required fields", () => {
    it("rejects missing title", () => {
      const { title, ...noTitle } = validFortune;
      const result = FortuneContentSchema.safeParse(noTitle);
      expect(result.success).toBe(false);
    });

    it("accepts missing description (nullable)", () => {
      const result = FortuneContentSchema.safeParse({
        ...validFortune,
        description: null,
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing type", () => {
      const { type, ...noType } = validFortune;
      const result = FortuneContentSchema.safeParse(noType);
      expect(result.success).toBe(false);
    });

    it("rejects missing price", () => {
      const { price, ...noPrice } = validFortune;
      const result = FortuneContentSchema.safeParse(noPrice);
      expect(result.success).toBe(false);
    });

    it("rejects missing isPublic", () => {
      const { isPublic, ...noPublic } = validFortune;
      const result = FortuneContentSchema.safeParse(noPublic);
      expect(result.success).toBe(false);
    });

    it("rejects missing tellerId", () => {
      const { tellerId, ...noTeller } = validFortune;
      const result = FortuneContentSchema.safeParse(noTeller);
      expect(result.success).toBe(false);
    });
  });

  // =========================================================================
  // 🔥 Type Safety - Ensure correct types from API
  // =========================================================================
  describe("type inference", () => {
    it("parsed result has correct types", () => {
      const result = FortuneContentSchema.safeParse(validFortune);
      expect(result.success).toBe(true);
      if (result.success) {
        const data = result.data;
        expect(typeof data.id).toBe("string");
        expect(typeof data.title).toBe("string");
        expect(typeof data.price).toBe("number");
        expect(typeof data.isPublic).toBe("boolean");
        expect(data.publishedAt).toBeInstanceOf(Date);
      }
    });
  });
});

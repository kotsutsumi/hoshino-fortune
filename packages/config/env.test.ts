import { describe, it, expect } from "vitest";
import { serverEnvSchema, clientEnvSchema } from "./env";

// =============================================================================
// 🔥 CRITICAL: Environment Variable Validation Tests
// If these fail, the server cannot start or connects to wrong services
// =============================================================================

describe("serverEnvSchema", () => {
  const validServerEnv = {
    DATABASE_URL: "libsql://db.turso.io",
    DATABASE_AUTH_TOKEN: "token123",
    BETTER_AUTH_SECRET: "super-secret-key-at-least-32-chars-long",
    BETTER_AUTH_URL: "https://auth.example.com",
    BETTER_AUTH_TRUSTED_ORIGINS: "https://app.example.com,https://admin.example.com",
    STRIPE_SECRET_KEY: "sk_test_1234567890",
    STRIPE_WEBHOOK_SECRET: "whsec_1234567890",
    LINE_CHANNEL_ID: "1234567890",
    LINE_CHANNEL_SECRET: "abcdefgh1234567890",
  };

  // =========================================================================
  // 🔥 DATABASE_URL - Server is useless without database
  // =========================================================================
  describe("DATABASE_URL", () => {
    it("accepts valid URL", () => {
      const result = serverEnvSchema.safeParse(validServerEnv);
      expect(result.success).toBe(true);
    });

    it("rejects missing DATABASE_URL - server cannot start", () => {
      const { DATABASE_URL, ...noDbUrl } = validServerEnv;
      const result = serverEnvSchema.safeParse(noDbUrl);
      expect(result.success).toBe(false);
    });

    it("rejects invalid URL format", () => {
      const result = serverEnvSchema.safeParse({
        ...validServerEnv,
        DATABASE_URL: "not-a-url",
      });
      expect(result.success).toBe(false);
    });

    it("accepts file:// URL for local SQLite", () => {
      const result = serverEnvSchema.safeParse({
        ...validServerEnv,
        DATABASE_URL: "file:./local.db",
      });
      expect(result.success).toBe(true);
    });
  });

  // =========================================================================
  // 🔥 BETTER_AUTH_SECRET - Authentication breaks without this
  // =========================================================================
  describe("BETTER_AUTH_SECRET", () => {
    it("accepts valid secret", () => {
      const result = serverEnvSchema.safeParse(validServerEnv);
      expect(result.success).toBe(true);
    });

    it("rejects missing secret - auth is completely broken", () => {
      const { BETTER_AUTH_SECRET, ...noSecret } = validServerEnv;
      const result = serverEnvSchema.safeParse(noSecret);
      expect(result.success).toBe(false);
    });

    it("rejects empty string or short secret (must be min 32 chars)", () => {
      // Schema now enforces minimum length of 32
      const result = serverEnvSchema.safeParse({
        ...validServerEnv,
        BETTER_AUTH_SECRET: "short-secret",
      });
      expect(result.success).toBe(false);

      const resultEmpty = serverEnvSchema.safeParse({
        ...validServerEnv,
        BETTER_AUTH_SECRET: "",
      });
      expect(resultEmpty.success).toBe(false);
    });
  });

  // =========================================================================
  // 🔥 BETTER_AUTH_URL - Required for production auth callbacks
  // =========================================================================
  describe("BETTER_AUTH_URL", () => {
    it("accepts valid HTTPS URL", () => {
      const result = serverEnvSchema.safeParse(validServerEnv);
      expect(result.success).toBe(true);
    });

    it("rejects missing URL in production", () => {
      const { BETTER_AUTH_URL, ...noUrl } = validServerEnv;
      const result = serverEnvSchema.safeParse(noUrl);
      expect(result.success).toBe(false);
    });

    it("rejects invalid URL", () => {
      const result = serverEnvSchema.safeParse({
        ...validServerEnv,
        BETTER_AUTH_URL: "not-a-url",
      });
      expect(result.success).toBe(false);
    });

    it("accepts HTTP for local development", () => {
      const result = serverEnvSchema.safeParse({
        ...validServerEnv,
        BETTER_AUTH_URL: "http://localhost:3000",
      });
      expect(result.success).toBe(true);
    });
  });

  // =========================================================================
  // ⚠️ BETTER_AUTH_TRUSTED_ORIGINS - Optional but affects CORS
  // =========================================================================
  describe("BETTER_AUTH_TRUSTED_ORIGINS", () => {
    it("accepts comma-separated origins", () => {
      const result = serverEnvSchema.safeParse(validServerEnv);
      expect(result.success).toBe(true);
    });

    it("accepts undefined (optional)", () => {
      const { BETTER_AUTH_TRUSTED_ORIGINS, ...noOrigins } = validServerEnv;
      const result = serverEnvSchema.safeParse(noOrigins);
      expect(result.success).toBe(true);
    });

    it("accepts empty string", () => {
      const result = serverEnvSchema.safeParse({
        ...validServerEnv,
        BETTER_AUTH_TRUSTED_ORIGINS: "",
      });
      expect(result.success).toBe(true);
    });
  });

  // =========================================================================
  // 🔥 STRIPE Keys - Payment processing fails without these
  // =========================================================================
  describe("Stripe configuration", () => {
    it("accepts missing STRIPE_SECRET_KEY (optional)", () => {
      const { STRIPE_SECRET_KEY, ...noKey } = validServerEnv;
      const result = serverEnvSchema.safeParse(noKey);
      expect(result.success).toBe(true);
    });

    it("accepts missing STRIPE_WEBHOOK_SECRET (optional)", () => {
      const { STRIPE_WEBHOOK_SECRET, ...noWebhook } = validServerEnv;
      const result = serverEnvSchema.safeParse(noWebhook);
      expect(result.success).toBe(true);
    });

    it("accepts test mode keys", () => {
      const result = serverEnvSchema.safeParse({
        ...validServerEnv,
        STRIPE_SECRET_KEY: "sk_test_51abc123",
        STRIPE_WEBHOOK_SECRET: "whsec_test_abc123",
      });
      expect(result.success).toBe(true);
    });

    it("accepts live mode keys", () => {
      const result = serverEnvSchema.safeParse({
        ...validServerEnv,
        STRIPE_SECRET_KEY: "sk_live_51abc123",
        STRIPE_WEBHOOK_SECRET: "whsec_live_abc123",
      });
      expect(result.success).toBe(true);
    });
  });

  // =========================================================================
  // ⚠️ LINE OAuth - Optional but affects social login
  // =========================================================================
  describe("LINE OAuth configuration", () => {
    it("accepts undefined LINE credentials", () => {
      const { LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, ...noLine } = validServerEnv;
      const result = serverEnvSchema.safeParse(noLine);
      expect(result.success).toBe(true);
    });

    it("accepts valid LINE credentials", () => {
      const result = serverEnvSchema.safeParse(validServerEnv);
      expect(result.success).toBe(true);
    });
  });

  // =========================================================================
  // 🔥 Production Enforcement
  // =========================================================================
  describe("Production Enforcement", () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
      vi.resetModules();
      process.env.NODE_ENV = "production";
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      vi.resetModules();
    });

    it("rejects missing STRIPE_SECRET_KEY in production", async () => {
      const { serverEnvSchema } = await import("./env");
      const prodEnv = {
        ...validServerEnv,
        UPSTASH_REDIS_REST_URL: "https://redis.upstash.io",
        UPSTASH_REDIS_REST_TOKEN: "token",
      };
      const { STRIPE_SECRET_KEY, ...noStripe } = prodEnv;
      const result = serverEnvSchema.safeParse(noStripe);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("STRIPE keys are required");
      }
    });

    it("rejects missing UPSTASH credentials in production", async () => {
      const { serverEnvSchema } = await import("./env");
      // Add Stripe keys so it doesn't fail on that first
      const envWithStripe = { ...validServerEnv };
      // Remove Upstash (if it was present in validServerEnv, but it wasn't explicitly added in validServerEnv definition above, 
      // let's ensure we are testing what we think we are. validServerEnv didn't have UPSTASH keys in the file I read.)
      
      // We need to construct a valid production env first
      const prodEnv = {
        ...validServerEnv,
        UPSTASH_REDIS_REST_URL: "https://redis.upstash.io",
        UPSTASH_REDIS_REST_TOKEN: "token",
      };
      
      const { UPSTASH_REDIS_REST_URL, ...noUpstash } = prodEnv;
      const result = serverEnvSchema.safeParse(noUpstash);
      expect(result.success).toBe(false);
       if (!result.success) {
        expect(result.error.issues[0].message).toContain("Upstash (Redis) must be configured");
      }
    });
  });

  // =========================================================================
  // 🔥 Full Validation - All required fields present
  // =========================================================================
  describe("complete validation", () => {
    it("accepts minimal required configuration", () => {
      const minimalConfig = {
        DATABASE_URL: "libsql://db.turso.io",
        BETTER_AUTH_SECRET: "12345678901234567890123456789012", // 32 chars
        BETTER_AUTH_URL: "https://auth.example.com",
        STRIPE_SECRET_KEY: "sk_test_123",
        STRIPE_WEBHOOK_SECRET: "whsec_123",
      };
      const result = serverEnvSchema.safeParse(minimalConfig);
      expect(result.success).toBe(true);
    });

    it("accepts full configuration with all optional fields", () => {
      const result = serverEnvSchema.safeParse(validServerEnv);
      expect(result.success).toBe(true);
    });
  });
});

describe("clientEnvSchema", () => {
  const validClientEnv = {
    NEXT_PUBLIC_API_URL: "https://api.example.com",
    EXPO_PUBLIC_API_URL: "https://api.example.com",
  };

  // =========================================================================
  // 🔥 NEXT_PUBLIC_API_URL - Web client cannot function without this
  // =========================================================================
  describe("NEXT_PUBLIC_API_URL", () => {
    it("accepts valid HTTPS URL", () => {
      const result = clientEnvSchema.safeParse(validClientEnv);
      expect(result.success).toBe(true);
    });

    it("rejects missing URL - web app cannot call API", () => {
      const { NEXT_PUBLIC_API_URL, ...noUrl } = validClientEnv;
      const result = clientEnvSchema.safeParse(noUrl);
      expect(result.success).toBe(false);
    });

    it("rejects invalid URL format", () => {
      const result = clientEnvSchema.safeParse({
        ...validClientEnv,
        NEXT_PUBLIC_API_URL: "not-a-url",
      });
      expect(result.success).toBe(false);
    });

    it("accepts localhost for development", () => {
      const result = clientEnvSchema.safeParse({
        ...validClientEnv,
        NEXT_PUBLIC_API_URL: "http://localhost:3000",
      });
      expect(result.success).toBe(true);
    });
  });

  // =========================================================================
  // 🔥 EXPO_PUBLIC_API_URL - Mobile app cannot function without this
  // =========================================================================
  describe("EXPO_PUBLIC_API_URL", () => {
    it("accepts valid HTTPS URL", () => {
      const result = clientEnvSchema.safeParse(validClientEnv);
      expect(result.success).toBe(true);
    });

    it("rejects missing URL - mobile app cannot call API", () => {
      const { EXPO_PUBLIC_API_URL, ...noUrl } = validClientEnv;
      const result = clientEnvSchema.safeParse(noUrl);
      expect(result.success).toBe(false);
    });

    it("accepts different URL from web (CDN/regional)", () => {
      const result = clientEnvSchema.safeParse({
        NEXT_PUBLIC_API_URL: "https://api.example.com",
        EXPO_PUBLIC_API_URL: "https://mobile-api.example.com",
      });
      expect(result.success).toBe(true);
    });
  });

  // =========================================================================
  // 🔥 Both URLs Required - Client apps need their endpoints
  // =========================================================================
  describe("complete validation", () => {
    it("requires both URLs", () => {
      const result = clientEnvSchema.safeParse(validClientEnv);
      expect(result.success).toBe(true);
    });

    it("fails when only NEXT_PUBLIC_API_URL provided", () => {
      const result = clientEnvSchema.safeParse({
        NEXT_PUBLIC_API_URL: "https://api.example.com",
      });
      expect(result.success).toBe(false);
    });

    it("fails when only EXPO_PUBLIC_API_URL provided", () => {
      const result = clientEnvSchema.safeParse({
        EXPO_PUBLIC_API_URL: "https://api.example.com",
      });
      expect(result.success).toBe(false);
    });
  });
});

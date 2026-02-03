import { describe, it, expect } from "vitest";
import { getTrustedOrigins } from "./auth";

describe("getTrustedOrigins", () => {
  it("should return explicit origins if set", () => {
    const env = {
      BETTER_AUTH_TRUSTED_ORIGINS: "http://example.com, https://app.example.com",
      BETTER_AUTH_URL: "http://localhost:3000",
    };
    const result = getTrustedOrigins(env, "production");
    expect(result).toEqual(["http://example.com", "https://app.example.com"]);
  });

  it("should throw in production if explicit origins are missing", () => {
    const env = {
      BETTER_AUTH_TRUSTED_ORIGINS: "",
      BETTER_AUTH_URL: "http://localhost:3000",
    };
    expect(() => getTrustedOrigins(env, "production")).toThrow("BETTER_AUTH_TRUSTED_ORIGINS must be set in production");
  });

  it("should return defaults in development if explicit origins are missing", () => {
    const env = {
      BETTER_AUTH_TRUSTED_ORIGINS: "",
      BETTER_AUTH_URL: "http://localhost:3000",
    };
    const result = getTrustedOrigins(env, "development");
    expect(result).toEqual(["http://localhost:3000", "exp://", "hoshino-fortune://"]);
  });
});



import { z } from "zod";

// Custom URL validator that accepts libsql:// scheme (for Turso)
const databaseUrlSchema = z.string().refine(
  (url) => {
    // Accept libsql:// URLs for Turso or standard http(s):// URLs
    return /^(libsql|https?|file):\/\/.+/.test(url);
  },
  { message: "Invalid DATABASE_URL: must be a valid URL (libsql://, https://, http://, or file://)" }
);

const baseServerEnvSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
  DATABASE_AUTH_TOKEN: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(), // Required in production
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(), // Comma separated list
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  LINE_CHANNEL_ID: z.string().optional(),
  LINE_CHANNEL_SECRET: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  // MVP_MODE allows skipping non-essential service requirements
  MVP_MODE: z.enum(["true", "false"]).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

export const serverEnvSchema = baseServerEnvSchema.refine(
  (data) => {
    // Check from parsed data to avoid build-time inlining issues
    const isProd = data.NODE_ENV === "production" || data.NODE_ENV === undefined;
    const isMvp = data.MVP_MODE === "true";
    if (isProd && !isMvp) {
      return !!data.UPSTASH_REDIS_REST_URL && !!data.UPSTASH_REDIS_REST_TOKEN;
    }
    return true;
  },
  {
    message: "Upstash (Redis) must be configured in production (set MVP_MODE=true to skip)",
    path: ["UPSTASH_REDIS_REST_URL"],
  }
).refine(
  (data) => {
    const isProd = data.NODE_ENV === "production" || data.NODE_ENV === undefined;
    if (isProd && data.DATABASE_URL.startsWith("libsql://")) {
      return !!data.DATABASE_AUTH_TOKEN;
    }
    return true;
  },
  {
    message: "DATABASE_AUTH_TOKEN is required for remote Turso in production",
    path: ["DATABASE_AUTH_TOKEN"],
  }
).refine(
  (data) => {
    // Check from parsed data to avoid build-time inlining issues
    const isProd = data.NODE_ENV === "production" || data.NODE_ENV === undefined;
    const isMvp = data.MVP_MODE === "true";
    if (isProd && !isMvp) {
      return !!data.STRIPE_SECRET_KEY && !!data.STRIPE_WEBHOOK_SECRET;
    }
    return true;
  },
  {
    message: "STRIPE keys are required in production (set MVP_MODE=true to skip)",
    path: ["STRIPE_SECRET_KEY"],
  }
);

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_API_URL: z.string().url(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
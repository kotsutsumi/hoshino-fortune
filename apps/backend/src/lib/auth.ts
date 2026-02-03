import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../db/schema";
import { env } from "../env";
import { db } from "../db";

export const getTrustedOrigins = (env: { BETTER_AUTH_TRUSTED_ORIGINS?: string; BETTER_AUTH_URL: string }, nodeEnv: string | undefined): string[] => {
  const explicit = env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map(s => s.trim()).filter(Boolean);
  if (explicit && explicit.length > 0) return explicit;
  
  if (nodeEnv === "production") {
    throw new Error("BETTER_AUTH_TRUSTED_ORIGINS must be set in production");
  }
  
  return [env.BETTER_AUTH_URL, "exp://", "hoshino-fortune://", "http://192.168.10.108:3000"];
};

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: getTrustedOrigins(env, process.env.NODE_ENV),
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
    }
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
});
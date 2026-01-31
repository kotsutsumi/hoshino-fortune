import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../db/schema";
import { env } from "../env";
import { db } from "../db";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS 
    ? env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map(s => s.trim()) 
    : [
        env.BETTER_AUTH_URL, 
        ...(process.env.NODE_ENV === "development" ? ["exp://"] : []),
        "hoshino-fortune://"
      ],
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
});
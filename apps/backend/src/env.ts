import { serverEnvSchema, type ServerEnv } from "@hoshino/config/env";

// Allow skipping validation for build steps (e.g. Docker build), but NEVER in production
const skipValidation = process.env.SKIP_ENV_VALIDATION === "true" && process.env.NODE_ENV !== "production";

let env: ServerEnv;

if (skipValidation) {
  env = process.env as unknown as ServerEnv;
} else {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 4)
    );
    throw new Error("Invalid environment variables");
  }
  env = parsed.data;
}

export { env };
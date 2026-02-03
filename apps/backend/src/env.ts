import { serverEnvSchema, type ServerEnv } from "@hoshino/config/env";

// Allow skipping validation for build steps (e.g. Docker build, Vercel build).
// Build-time environment is detected via NEXT_PHASE containing "build"
const isBuildPhase = process.env.NEXT_PHASE?.includes("build") ||
                     process.env.SKIP_ENV_VALIDATION === "true";
const skipValidation = isBuildPhase;

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
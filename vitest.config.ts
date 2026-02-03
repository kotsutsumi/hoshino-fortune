import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.ts", "apps/**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "dist",
      ".next",
      ".turbo",
      "**/e2e/**",
    ],
    alias: {
      "@/db": path.resolve(__dirname, "./apps/backend/src/db"),
      "@/db/schema": path.resolve(__dirname, "./apps/backend/src/db/schema"),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["packages/*/index.ts", "packages/*/env.ts"],
      exclude: ["**/*.test.ts", "**/*.d.ts", "node_modules/**"],
    },
    passWithNoTests: false, // 🔥 テストが無いなら落とす
    testTimeout: 10000,
    hookTimeout: 10000,
    env: {
      DATABASE_URL: "libsql://memory",
      BETTER_AUTH_SECRET: "mock_secret_min_32_chars_long_12345678",
      BETTER_AUTH_URL: "http://localhost:3000",
    },
  },
});

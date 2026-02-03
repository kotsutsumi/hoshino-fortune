import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { env } from "../env";
import { logger } from "../lib/logger";

export const fetchWithRetry = async (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 10000;
  let attempt = 0;

  while (true) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      attempt++;
      const urlStr = url instanceof Request ? url.url : url.toString();
      const isAbort = error instanceof Error && error.name === "AbortError";
      
      if (attempt >= MAX_RETRIES) {
        logger.error({ error, url: urlStr, attempt, isAbort }, "DB connection failed after retries");
        throw new Error("Database connection failed");
      }
      
      logger.warn({ error, url: urlStr, attempt, isAbort }, "DB connection failed, retrying...");
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100 + Math.random() * 100));
    } finally {
      clearTimeout(timeoutId);
    }
  }
};

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
  fetch: env.DATABASE_URL.startsWith("http") ? fetchWithRetry : undefined,
});

export const db = drizzle(client, { schema });

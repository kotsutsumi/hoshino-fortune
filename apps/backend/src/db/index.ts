import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { env } from "../env";

const fetchWithRetry = async (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (true) {
    try {
      return await fetch(url, init);
    } catch (error) {
      attempt++;
      if (attempt >= MAX_RETRIES) throw error;
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }
};

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
  fetch: env.DATABASE_URL.startsWith("http") ? fetchWithRetry : undefined,
});

export const db = drizzle(client, { schema });

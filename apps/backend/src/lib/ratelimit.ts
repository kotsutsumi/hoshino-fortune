import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Use console for Edge runtime compatibility (pino doesn't work in Edge)
const edgeLogger = {
  error: (...args: unknown[]) => console.error("[ratelimit]", ...args),
  warn: (...args: unknown[]) => console.warn("[ratelimit]", ...args),
};

let instance: Ratelimit | undefined;

function getInstance() {
  if (instance) return instance;

  // Use process.env directly to avoid env validation issues in Edge runtime
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (
    typeof upstashUrl === "string" &&
    upstashUrl.length > 0 &&
    typeof upstashToken === "string" &&
    upstashToken.length > 0
  ) {
    instance = new Ratelimit({
      redis: new Redis({
        url: upstashUrl,
        token: upstashToken,
      }),
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      analytics: true,
      prefix: "@hoshino/ratelimit",
    });
    return instance;
  }
  return undefined;
}


// Export a wrapper that behaves like the Ratelimit instance but initializes lazily
export const ratelimit = {
  limit: async (identifier: string) => {
    const limiter = getInstance();
    
    if (limiter) {
      return limiter.limit(identifier);
    }

    const isProd = process.env.NODE_ENV === "production" || process.env.NODE_ENV === undefined;
    const isMvp = process.env.MVP_MODE === "true";
    if (isProd && !isMvp) {
      edgeLogger.error("Rate limiting is NOT configured in production! Failing closed.");
      throw new Error("Rate limiting configuration missing in production");
    }
    if (isProd && isMvp) {
      edgeLogger.warn("Rate limiting is NOT configured in MVP mode. Allowing request.");
    }

    edgeLogger.warn("Rate limiting is NOT configured. Allowing request (Dev/Test only).");
    return { success: true, limit: 20, remaining: 20, reset: Date.now() } as const;
  },
  // For testing purposes only
  _reset: () => {
    instance = undefined;
  },
};

export async function checkRateLimit(identifier: string) {
  const result = await ratelimit.limit(identifier);
  return result;
}

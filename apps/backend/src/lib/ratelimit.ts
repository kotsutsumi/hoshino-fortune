import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "../env";
import { logger } from "./logger";

let instance: Ratelimit | undefined;

function getInstance() {
  if (instance) return instance;
  
  if (
    typeof env.UPSTASH_REDIS_REST_URL === "string" && 
    env.UPSTASH_REDIS_REST_URL.length > 0 && 
    typeof env.UPSTASH_REDIS_REST_TOKEN === "string" && 
    env.UPSTASH_REDIS_REST_TOKEN.length > 0
  ) {
    instance = new Ratelimit({
      redis: new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
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

    if (process.env.NODE_ENV === "production") {
      logger.error("Rate limiting is NOT configured in production! Failing closed.");
      throw new Error("Rate limiting configuration missing in production");
    }

    logger.warn("Rate limiting is NOT configured. Allowing request (Dev/Test only).");
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

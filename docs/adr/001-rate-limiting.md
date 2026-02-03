# ADR 001: Rate Limiting Strategy for API Authentication

## Status
Accepted

## Context
The application exposes authentication endpoints (`/api/auth/*`) that are vulnerable to brute-force and credential stuffing attacks. To mitigate this, a rate limiting mechanism is required.
Currently, the application runs on a serverless environment (Vercel).

## Decision
For the MVP phase, we have implemented a basic **in-memory** rate limiting middleware.
However, we acknowledge that in-memory rate limiting is insufficient for serverless production environments because:
1.  **State Isolation**: Each serverless function instance maintains its own memory. An attacker can hit different instances to bypass the limit.
2.  **Lifecycle**: Memory is cleared when the function scales down or cold starts.

Therefore, for the **Production** environment, we mandate the use of an external, distributed rate limiting solution.

## Production Implementation Plan
Before deploying to production, the rate limiting logic MUST be updated to use one of the following:

1.  **Upstash Rate Limit**: Use `@upstash/ratelimit` with Redis. This provides a global, low-latency counter.
2.  **Vercel KV**: Similar to Upstash, used to store request counts.
3.  **Cloudflare Rate Limiting**: Offload the responsibility to the edge proxy (Cloudflare) if available.

The current code in `apps/backend/src/middleware.ts` serves as a functional placeholder for local development and E2E testing but is explicitly **NOT** intended for high-scale production use without this upgrade.

## Consequences
- **Positive**: Enables safe development and testing immediately without infrastructure overhead.
- **Negative**: Requires a code change/configuration change before "Production" promotion.
- **Risk**: If this upgrade is forgotten, the production app will have weak protection against distributed attacks. (Mitigated by this ADR and code comments).

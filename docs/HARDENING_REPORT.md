# Hardening Report - 2026-01-31

## 1. 全体設計（1〜2画面）
The system is a Monorepo containing a Next.js Backend (App Router) and an Expo Mobile App.
- **Backend:** Serves REST APIs and Authentication via BetterAuth. Connects to Turso (LibSQL) and uses Upstash Redis for Rate Limiting.
- **Mobile:** Connects to the Backend via a shared Typed API Client.
- **Shared:** Logic is strictly separated into `packages/domain` (Business Logic/Types), `packages/api` (Schema/Client), and `packages/config` (Env).

## 2. ディレクトリ構成
```
/
├── apps/
│   ├── backend/   # Next.js (Auth, API, Admin)
│   └── frontend/  # Expo (iOS/Android Client)
├── packages/
│   ├── api/       # API Definitions & Zod Schemas
│   ├── config/    # Environment Variables & Config
│   └── domain/    # Shared Business Logic & Types
└── docs/          # Documentation
```

## 3. データフロー
1. **Request:** Client (Expo/Web) -> Next.js Middleware (Rate Limit).
2. **Auth:** BetterAuth validates session/token.
3. **API Layer:** Next.js Route Handlers validate input using `packages/api` schemas.
4. **Service Layer:** Connects to Turso (LibSQL) via Drizzle ORM.
5. **Response:** Typed JSON returned to Client.

## 4. 認証・認可設計
- **Framework:** BetterAuth (Email/Password).
- **Security:** 
  - Strict Origin Validation (Production excludes `exp://` and custom schemes by default).
  - Rate Limiting on Auth Routes (Fail-Closed policy).
  - Secure Session Management via Drizzle Adapter.

## 5. 実装コード (Critical Fixes Implemented)
- **`packages/api/index.ts`**: Fixed missing `FortuneContent` type import to prevent compilation errors.
- **`apps/frontend/hooks/useFortunes.ts`**: Replaced `useRef` with global `fetchingAtom` to prevent race conditions in React Strict Mode and across components.
- **`apps/backend/src/lib/auth.ts`**: Hardened `trustedOrigins` (Fixed empty string vulnerability, removed hardcoded custom schemes in production).
- **`apps/backend/src/db/index.ts`**: Improved DB connection retry logic with logging, jitter, and proper error rethrowing.
- **`packages/config/env.ts`**: Added strict validation for `DATABASE_AUTH_TOKEN` when using remote Turso in production.
- **`apps/backend/src/middleware.ts`**: Stricter IP resolution (reject requests with unknown IP/Origin) to prevent rate limit bypass.

## 6. 将来拡張ポイント
- **State Management:** Migrate from Global Jotai Atoms to Context/Provider pattern to support SSR/RSC in the future.
- **Error Handling:** Standardize API Error Codes across the monorepo.
- **Testing:** Add E2E tests for the Mobile authentication flow.

## 7. 今回やらないこと（理由付き）
- **Full SSR for Frontend:** Currently an Expo SPA/Native app; SSR adds complexity not needed for the current requirements.
- **Advanced DDoS Protection:** Relying on Vercel/Upstash basic protection for now; avoiding premature optimization.
- **Global Atom Refactor:** High effort; fixed the immediate race condition, but full refactor is deferred.
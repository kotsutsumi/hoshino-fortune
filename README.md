# Hoshino Fortune

Monorepo for Hoshino Fortune app and administration.

## Structure

- `apps/backend`: Next.js (Admin, API, Web)
- `apps/frontend`: Expo (iOS / Android)
- `packages/domain`: Shared types and schemas
- `packages/api`: Shared API client
- `packages/config`: Shared configurations
- `packages/ui`: Shared UI components

## Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables:
   Copy `.env.example` to `.env` in the root and in `apps/backend`.

3. Start development:
   ```bash
   bun dev
   ```

## Database

Uses Turso (LibSQL) with Drizzle ORM.
To push schema changes:
```bash
cd apps/backend
bun x drizzle-kit push
```

## Deployment

- Backend: Vercel
- Mobile: EAS (Expo Application Services)
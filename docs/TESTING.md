# Testing Strategy & Requirements

## Critical Testing Requirements

### 1. Payment Integration (Stripe)
**Status:** Pending Implementation
**Priority:** P0 (Blocker for Release)

When implementing the Payment feature, the following testing strategy is **MANDATORY**:

#### A. Webhook Verification (Integration Test)
- **Goal:** Ensure `POST /api/webhooks/stripe` correctly verifies signatures and handles events.
- **Tools:** `stripe-mock` or mocked Stripe SDK.
- **Scenarios:**
  1. **Valid Signature:** Event is processed, DB updated (e.g., `checkout.session.completed` -> create `purchase` record).
  2. **Invalid Signature:** Returns `400 Bad Request`.
  3. **Duplicate Event:** Idempotency check ensures no double-purchase.
  4. **Unhandled Event:** Returns `200 OK` (to ignore safely) without side effects.

#### B. Payment Intent Flow (E2E Test)
- **Goal:** Verify the full user journey from "Buy" click to "Success" page.
- **Tools:** Playwright with Stripe Test Mode credentials.
- **Scenarios:**
  1. User selects Fortune -> Redirects to Stripe Checkout.
  2. User completes payment (using Test Card 4242...).
  3. Redirects back to `/fortunes/[id]/success`.
  4. Verify DB has `purchase` record with status `succeeded`.
  5. Verify user can now access the content.

#### C. Unit Tests
- Test the logic that calculates prices or determines access rights based on purchase history.

---

### 2. Authorization
**Status:** Implemented & Tested
- Private (`isPublic: false`) content returns `403 Forbidden` for public access.
- Admin APIs (future) must be tested for role-based access control (RBAC).

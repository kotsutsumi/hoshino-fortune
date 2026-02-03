import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { env } from "@/env";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import Stripe from "stripe";
import { z } from "zod";

const MetadataSchema = z.object({
  userId: z.string().uuid(),
  fortuneId: z.string().uuid(),
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  if (!signature) {
    logger.warn("Stripe Webhook: Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    if (!env.STRIPE_WEBHOOK_SECRET) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    logger.error({ error: errorMessage }, "Stripe Webhook: Signature verification failed");
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Validate metadata
      const metadataResult = MetadataSchema.safeParse(session.metadata);

      if (!metadataResult.success) {
        logger.error({ sessionId: session.id, errors: metadataResult.error.format() }, "Stripe Webhook: Invalid or missing metadata");
        // We return 200 to Stripe to stop retries for unprocessable data (bad request from client side essentially)
        // unless we want to retry? If metadata is missing, retrying won't fix it.
        return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
      }

      const { userId, fortuneId } = metadataResult.data;

      try {
        const { purchases } = await import("@/db/schema");
        const { db } = await import("@/db");
        
        await db.insert(purchases).values({
          id: `pur_${crypto.randomUUID()}`,
          userId,
          fortuneId,
          stripeSessionId: session.id,
          amount: session.amount_total || 0,
          currency: session.currency || "jpy",
          status: "completed",
        }).onConflictDoNothing({ target: purchases.stripeSessionId });

        logger.info({ sessionId: session.id, userId, fortuneId }, "Stripe Webhook: Purchase processed");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        logger.error({ error: errorMessage, sessionId: session.id }, "Stripe Webhook: Failed to record purchase");
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      break;
    default:
      logger.info({ type: event.type }, "Stripe Webhook: Unhandled event type");
  }

  return NextResponse.json({ received: true });
}

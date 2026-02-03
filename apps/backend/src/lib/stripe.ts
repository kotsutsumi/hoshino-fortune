import Stripe from "stripe";
import { env } from "../env";

if (!env.STRIPE_SECRET_KEY && process.env.NODE_ENV === "production") {
  throw new Error("STRIPE_SECRET_KEY is required in production");
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  // @ts-expect-error: Stripe SDK version mismatch with strict typing, but API version is valid
  apiVersion: "2024-06-20",
  typescript: true,
});

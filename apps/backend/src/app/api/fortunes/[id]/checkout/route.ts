import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { fortuneContents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { env } from "@/env";
import { headers } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: fortuneId } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fortune = await db.query.fortuneContents.findFirst({
      where: eq(fortuneContents.id, fortuneId),
    });

    if (!fortune) {
      return NextResponse.json({ error: "Fortune not found" }, { status: 404 });
    }

    if (!fortune.isPublic) {
      return NextResponse.json({ error: "Fortune is not available" }, { status: 403 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: fortune.title,
              description: fortune.description || undefined,
            },
            unit_amount: fortune.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.BETTER_AUTH_URL}/fortunes/${fortuneId}/result?success=true`,
      cancel_url: `${env.BETTER_AUTH_URL}/fortunes/${fortuneId}?canceled=true`,
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
        fortuneId: fortune.id,
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { fortuneContents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { FortuneContentSchema } from "@hoshino/domain";
import { logger } from "@/lib/logger";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    // Validate UUID
    const uuidSchema = z.string().uuid();
    const parseResult = uuidSchema.safeParse(id);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(fortuneContents)
      .where(eq(fortuneContents.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Fortune not found" },
        { status: 404 }
      );
    }

    const fortune = result[0];

    if (!fortune.isPublic) {
        return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
        );
    }

    // Validate response against domain schema safely
    const validationResult = FortuneContentSchema.safeParse({
      ...fortune,
      createdAt: fortune.createdAt || new Date(), // Fallback for safety, though schema has default
      updatedAt: fortune.updatedAt || new Date(),
    });

    if (!validationResult.success) {
      logger.error({ fortuneId: id, error: validationResult.error }, "Fortune content validation failed");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(validationResult.data);
  } catch (error) {
    logger.error({ error }, "Failed to fetch fortune");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

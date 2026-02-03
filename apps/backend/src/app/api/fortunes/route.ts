import { NextResponse } from "next/server";
import { db } from "@/db";
import { fortuneContents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { FortuneContentSchema } from "@hoshino/domain";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const fortunes = await db
      .select()
      .from(fortuneContents)
      .where(eq(fortuneContents.isPublic, true));

    // Validate response against domain schema safely
    const rawFortunes = fortunes.map(f => ({
      ...f,
      createdAt: f.createdAt || new Date(),
      updatedAt: f.updatedAt || new Date(),
    }));

    const validatedFortunes = rawFortunes.reduce<z.infer<typeof FortuneContentSchema>[]>((acc, f) => {
      const parsed = FortuneContentSchema.safeParse(f);
      if (parsed.success) {
        acc.push(parsed.data);
      } else {
        // Log minimal info in production to prevent leaking sensitive schema details
        if (process.env.NODE_ENV === "production") {
            logger.error({ fortuneId: f.id }, "Skipping invalid fortune content");
        } else {
            logger.error({ fortuneId: f.id, error: parsed.error }, "Skipping invalid fortune content");
        }
      }
      return acc;
    }, []);

    return NextResponse.json(validatedFortunes);
  } catch (error) {
    logger.error({ error }, "Failed to fetch fortunes");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

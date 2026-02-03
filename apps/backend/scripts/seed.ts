import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { fortuneTellers, fortuneContents } from "../src/db/schema";
import * as schema from "../src/db/schema";
import { env } from "../src/env";
import { sql } from "drizzle-orm";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function seed() {
    const isAllowed = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
    if (!isAllowed) {
      console.error(`❌ Seed script cannot run in ${process.env.NODE_ENV} environment!`);
      process.exit(1);
    }

    console.log("🌱 Seeding database...");

    const FIXED_TELLER_ID = "11111111-1111-1111-1111-111111111111";
    const PUBLIC_FORTUNE_ID = "22222222-2222-2222-2222-222222222222";
    const PRIVATE_FORTUNE_ID = "33333333-3333-3333-3333-333333333333";

    try {
        // Upsert Teller
        const existingTeller = await db.select().from(fortuneTellers).where(sql`id = ${FIXED_TELLER_ID}`).get();
        if (!existingTeller) {
             await db.insert(fortuneTellers).values({
                id: FIXED_TELLER_ID,
                name: "Mystic Mona",
                profile: "Expert in ancient runic divination.",
                isActive: true,
            });
            console.log("Created Teller");
        }

        // Upsert Public Fortune
        const existingPublic = await db.select().from(fortuneContents).where(sql`id = ${PUBLIC_FORTUNE_ID}`).get();
        if (!existingPublic) {
            await db.insert(fortuneContents).values({
                id: PUBLIC_FORTUNE_ID,
                title: "Your Daily Fortune",
                description: "Today is a great day to start something new.",
                type: "daily",
                price: 0,
                isPublic: true,
                tellerId: FIXED_TELLER_ID,
                publishedAt: new Date(),
            });
            console.log("Created Public Fortune");
        }

        // Upsert Private Fortune
        const existingPrivate = await db.select().from(fortuneContents).where(sql`id = ${PRIVATE_FORTUNE_ID}`).get();
        if (!existingPrivate) {
            await db.insert(fortuneContents).values({
                id: PRIVATE_FORTUNE_ID,
                title: "Secret Premium Fortune",
                description: "This is for premium members only.",
                type: "premium",
                price: 500,
                isPublic: false,
                tellerId: FIXED_TELLER_ID,
                publishedAt: new Date(),
            });
             console.log("Created Private Fortune");
        }
        
        console.log("✅ Seeding complete!");
    } catch (e) {
        console.error("Error seeding:", e);
        process.exit(1);
    }
}

seed();

import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const timestamp = (name: string) =>
  integer(name, { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  lineUserId: text("line_user_id").unique(),
  birthDate: integer("birth_date", { mode: "timestamp" }),
  gender: text("gender"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"), // user, admin
  status: text("status", { enum: ["active", "suspended"] }).notNull().default("active"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (table) => ({
  userIdIdx: index("sessions_user_id_idx").on(table.userId),
}));

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  password: text("password"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (table) => ({
  userIdIdx: index("accounts_user_id_idx").on(table.userId),
}));

export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const fortuneTellers = sqliteTable("fortune_tellers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  profile: text("profile"),
  avatarUrl: text("avatar_url"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const fortuneContents = sqliteTable("fortune_contents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["daily", "premium", "special", "tarot", "crystal", "runic", "horoscope"] }).notNull(),
  price: integer("price").notNull().default(0),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
  tellerId: text("teller_id")
    .notNull()
    .references(() => fortuneTellers.id),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
}, (table) => ({
  isPublicIdx: index("fortune_contents_is_public_idx").on(table.isPublic),
  tellerIdIdx: index("fortune_contents_teller_id_idx").on(table.tellerId),
  publishedAtIdx: index("fortune_contents_published_at_idx").on(table.publishedAt),
}));

export const purchases = sqliteTable("purchases", {

  id: text("id").primaryKey(),

  userId: text("user_id")

    .notNull()

    .references(() => users.id),

  fortuneId: text("fortune_id")

    .notNull()

    .references(() => fortuneContents.id),

  stripeSessionId: text("stripe_session_id").unique().notNull(),

  amount: integer("amount").notNull(),

  currency: text("currency").notNull().default("jpy"),

  status: text("status", { enum: ["pending", "completed", "failed", "refunded", "cancelled"] }).notNull().default("pending"),

  createdAt: timestamp("created_at"),

  updatedAt: timestamp("updated_at"),

}, (table) => ({

  userIdIdx: index("purchases_user_id_idx").on(table.userId),

  stripeSessionIdIdx: index("purchases_stripe_session_id_idx").on(table.stripeSessionId),

}));



// Subscriptions table removed per MVP scope and Principal Architect review

// to prevent dead code and potential security risks from incomplete implementation.

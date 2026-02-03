import { z } from "zod";

export const UserStatusSchema = z.enum(["active", "suspended"]);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserRoleSchema = z.enum(["user", "admin"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  lineUserId: z.string().nullable(),
  name: z.string().nullable(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  birthDate: z.coerce.date().nullable(),
  gender: z.string().nullable(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

export const FortuneTypeSchema = z.enum(["daily", "premium", "special", "tarot", "crystal", "runic", "horoscope"]);
export type FortuneType = z.infer<typeof FortuneTypeSchema>;

export const FortuneContentSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  type: FortuneTypeSchema,
  price: z.number().int().nonnegative(),
  isPublic: z.boolean(),
  tellerId: z.string().uuid(),
  publishedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type FortuneContent = z.infer<typeof FortuneContentSchema>;
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";
import { UserRoleSchema, type UserRole } from "@hoshino/domain";
import type { AuthSession } from "@/types/auth-types";

const ADMIN_ROLES: UserRole[] = ["admin"];

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  }) as AuthSession | null;

  if (!session) {
    logger.warn("Unauthorized admin access attempt: No session");
    redirect("/login");
  }

  // Role verification
  const roleParse = UserRoleSchema.safeParse(session.user.role);

  if (!roleParse.success || !ADMIN_ROLES.includes(roleParse.data)) {
    logger.warn({ userId: session.user.id, role: session.user.role }, "Unauthorized admin access attempt: Insufficient permissions");
    throw new Error("Unauthorized: Admin access required");
  }

  return session;
}

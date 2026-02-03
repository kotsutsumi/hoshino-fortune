import { auth } from "@/lib/auth";
import { UserRole } from "@hoshino/domain";

export type Session = typeof auth.$Infer.Session;

// Define the user shape we expect from the DB adapter
export type AuthUser = Session["user"] & {
  role: UserRole;
};

export type AuthSession = Omit<Session, "user"> & {
  user: AuthUser;
};

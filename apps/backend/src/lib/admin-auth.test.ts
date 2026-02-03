import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireAdmin } from "./admin-auth";
import { redirect } from "next/navigation";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@hoshino/domain", () => ({
  UserRoleSchema: {
    safeParse: vi.fn((role) => {
        if (role === "admin" || role === "user") {
            return { success: true, data: role };
        }
        return { success: false };
    })
  }
}));

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return session if user is admin", async () => {
    const mockSession = {
      user: {
        id: "admin-user",
        role: "admin",
      },
    };
    const { auth } = await import("@/lib/auth");
    (auth.api.getSession as any).mockResolvedValue(mockSession);

    const session = await requireAdmin();
    expect(session).toEqual(mockSession);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should redirect to signin if no session exists", async () => {
    const { auth } = await import("@/lib/auth");
    (auth.api.getSession as any).mockResolvedValue(null);

    try {
      await requireAdmin();
    } catch (e) {
      // redirect might throw in Next.js, but here it is a mock function.
      // If implementation calls redirect(), we expect it to be called.
    }
    
    expect(redirect).toHaveBeenCalledWith("/api/auth/signin");
  });

  it("should throw error if user is not admin", async () => {
    const mockSession = {
      user: {
        id: "regular-user",
        role: "user",
      },
    };
    const { auth } = await import("@/lib/auth");
    (auth.api.getSession as any).mockResolvedValue(mockSession);

    await expect(requireAdmin()).rejects.toThrow("Unauthorized: Admin access required");
    expect(redirect).not.toHaveBeenCalled();
  });
});
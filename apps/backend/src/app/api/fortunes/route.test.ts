import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

// Mock dependencies
const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([]),
  }
}));

vi.mock("@/db", () => ({
  db: mockDb,
}));

vi.mock("@/db/schema", () => ({
  fortuneContents: { isPublic: "isPublic" },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("GET /api/fortunes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array when no fortunes found", async () => {
    mockDb.where.mockResolvedValue([]);
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([]);
  });

  it("should return valid fortunes", async () => {
    const validFortune = {
      id: "00000000-0000-0000-0000-000000000001",
      title: "Test Fortune",
      description: "A test fortune",
      type: "daily",
      price: 0,
      isPublic: true,
      tellerId: "00000000-0000-0000-0000-000000000002",
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.where.mockResolvedValue([validFortune]);

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe(validFortune.id);
  });

  it("should filter out invalid fortunes", async () => {
    const validFortune = {
      id: "00000000-0000-0000-0000-000000000001",
      title: "Test Fortune",
      description: "A test fortune",
      type: "daily",
      price: 0,
      isPublic: true,
      tellerId: "00000000-0000-0000-0000-000000000002",
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const invalidFortune = {
      id: "00000000-0000-0000-0000-000000000003",
      title: "Invalid Fortune",
      type: "invalid_type", // Invalid type
      price: 0,
      isPublic: true,
      tellerId: "00000000-0000-0000-0000-000000000002",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.where.mockResolvedValue([validFortune, invalidFortune]);

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe(validFortune.id);
  });

  it("should return 500 on database error", async () => {
    mockDb.where.mockRejectedValue(new Error("DB Error"));
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
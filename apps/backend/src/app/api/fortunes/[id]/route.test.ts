import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

// Use vi.hoisted to define mocks before they are used in vi.mock factory
const mocks = vi.hoisted(() => {
  const mockLimit = vi.fn();
  const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
  const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
  const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
  return {
    mockSelect,
    mockFrom,
    mockWhere,
    mockLimit
  };
});

vi.mock("@/db", () => ({
  db: {
    select: mocks.mockSelect,
  },
}));

describe("GET /api/fortunes/[id] Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-establish the chain in case it was cleared (though mockReturnValue persists usually, clearAllMocks clears calls)
    // mockReturnValue is implementation, clearAllMocks clears history.
    // However, if we want to reset implementations, we should use mockReset. 
    // For safety, let's ensure the chain structure is intact.
    mocks.mockSelect.mockReturnValue({ from: mocks.mockFrom });
    mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });
    mocks.mockWhere.mockReturnValue({ limit: mocks.mockLimit });
  });

  it("returns 403 Forbidden for non-public fortune", async () => {
    // 1. Setup Mock
    const mockFortune = {
      id: "11111111-1111-1111-1111-111111111111",
      isPublic: false,
    };

    mocks.mockLimit.mockResolvedValue([mockFortune]);

    // 2. Execute
    const req = new Request("http://localhost:3000/api/fortunes/11111111-1111-1111-1111-111111111111");
    const res = await GET(req, { params: Promise.resolve({ id: "11111111-1111-1111-1111-111111111111" }) });

    // 3. Assert
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("Forbidden");
  });

  it("returns 200 OK for public fortune", async () => {
    // 1. Setup Mock
    const mockFortune = {
      id: "22222222-2222-2222-2222-222222222222",
      title: "Test Fortune",
      description: "Desc",
      type: "daily",
      price: 0,
      isPublic: true,
      tellerId: "44444444-4444-4444-4444-444444444444", // Valid UUID
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mocks.mockLimit.mockResolvedValue([mockFortune]);

    // 2. Execute
    const req = new Request("http://localhost:3000/api/fortunes/22222222-2222-2222-2222-222222222222");
    const res = await GET(req, { params: Promise.resolve({ id: "22222222-2222-2222-2222-222222222222" }) });

    // 3. Assert
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("22222222-2222-2222-2222-222222222222");
  });

  it("returns 404 for non-existent fortune", async () => {
    // 1. Setup Mock (return empty array)
    mocks.mockLimit.mockResolvedValue([]);

    // 2. Execute
    const req = new Request("http://localhost:3000/api/fortunes/33333333-3333-3333-3333-333333333333");
    const res = await GET(req, { params: Promise.resolve({ id: "33333333-3333-3333-3333-333333333333" }) });

    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid UUID format", async () => {
    // 2. Execute
    const req = new Request("http://localhost:3000/api/fortunes/invalid-uuid");
    const res = await GET(req, { params: Promise.resolve({ id: "invalid-uuid" }) });

    // 3. Assert
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid ID format");
  });

  it("returns 500 when database throws", async () => {
    // 1. Setup Mock
    mocks.mockLimit.mockRejectedValue(new Error("DB Error"));

    // 2. Execute
    const req = new Request("http://localhost:3000/api/fortunes/55555555-5555-5555-5555-555555555555");
    const res = await GET(req, { params: Promise.resolve({ id: "55555555-5555-5555-5555-555555555555" }) });

    // 3. Assert
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Internal Server Error");
  });
});
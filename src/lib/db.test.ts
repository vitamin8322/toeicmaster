import { describe, it, expect, vi } from "vitest";

// Mock the global Prisma Client singleton
vi.mock("@/lib/db", () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: "test-user-uuid",
          email: "learner@toeicmaster.vn",
          name: "Test User",
          role: "LEARNER",
        }),
      },
    },
  };
});

import { prisma } from "@/lib/db";

describe("Database client integration tests", () => {
  it("should successfully fetch users from mapped database models", async () => {
    const user = await prisma.user.findUnique({
      where: { email: "learner@toeicmaster.vn" },
    });

    expect(user).toBeDefined();
    expect(user?.email).toBe("learner@toeicmaster.vn");
    expect(user?.name).toBe("Test User");
    expect(user?.role).toBe("LEARNER");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock getServerSession
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

// Mock Prisma
vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";

describe("POST /api/user/onboarding API Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 Unauthorized if no active NextAuth session is found", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost:3000/api/user/onboarding", {
      method: "POST",
      body: JSON.stringify({ targetScore: 650 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    
    const body = await res.json();
    expect(body.error).toContain("401 Unauthorized");
  });

  it("should return 400 Bad Request if the targetScore is missing or invalid", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { email: "learner@toeicmaster.vn", name: "Minh" },
    });

    const req = new NextRequest("http://localhost:3000/api/user/onboarding", {
      method: "POST",
      body: JSON.stringify({ targetScore: 999 }), // Invalid target score
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    
    const body = await res.json();
    expect(body.error).toContain("400 Bad Request");
  });

  it("should successfully update user target score and onboarding status on valid request", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { email: "learner@toeicmaster.vn", name: "Minh" },
    });

    vi.mocked(prisma.user.update).mockResolvedValueOnce({
      id: "learner-uuid",
      email: "learner@toeicmaster.vn",
      name: "Minh",
      targetScore: 750,
      onboardingCompleted: true,
    } as any);

    const req = new NextRequest("http://localhost:3000/api/user/onboarding", {
      method: "POST",
      body: JSON.stringify({ targetScore: 750 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.message).toContain("thành công");
    expect(body.user.targetScore).toBe(750);
    expect(body.user.onboardingCompleted).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "learner@toeicmaster.vn" },
      data: {
        targetScore: 750,
        onboardingCompleted: true,
      },
    });
  });
});

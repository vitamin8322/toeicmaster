import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { GET as GET_BY_ID, PATCH, DELETE } from "./[id]/route";
import { NextRequest } from "next/server";

// Mock getServerSession
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

// Mock Prisma client singleton
vi.mock("@/lib/db", () => ({
  prisma: {
    question: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";

describe("Administrative Questions CRUD Portal APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/questions", () => {
    it("should return 403 Forbidden if user lacks ADMIN role", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { email: "learner@toeicmaster.vn", role: "LEARNER" },
      });

      const req = new NextRequest("http://localhost:3000/api/admin/questions");
      const res = await GET(req);

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error).toContain("403 Forbidden");
    });

    it("should return 200 and list matching paginated records on valid Admin authorization", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { email: "admin@toeicmaster.vn", role: "ADMIN" },
      });

      vi.mocked(prisma.$transaction).mockResolvedValueOnce([
        1,
        [
          {
            id: "q-uuid-1",
            text: "Question Prompt",
            part: 5,
            difficulty: "easy",
            subSkillTag: "adverbs",
            correctAnswer: "A",
          },
        ],
      ]);

      const req = new NextRequest("http://localhost:3000/api/admin/questions?page=1&limit=10");
      const res = await GET(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.total).toBe(1);
      expect(body.questions.length).toBe(1);
      expect(body.questions[0].id).toBe("q-uuid-1");
    });
  });

  describe("POST /api/admin/questions", () => {
    it("should return 403 Forbidden if requester is not an ADMIN", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { email: "learner@toeicmaster.vn", role: "LEARNER" },
      });

      const req = new NextRequest("http://localhost:3000/api/admin/questions", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const res = await POST(req);
      expect(res.status).toBe(403);
    });

    it("should return 400 Bad Request if schema Zod constraints are violated", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { email: "admin@toeicmaster.vn", role: "ADMIN" },
      });

      // Submit an empty body payload which violates Zod schema requirements
      const req = new NextRequest("http://localhost:3000/api/admin/questions", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("400 Bad Request");
      expect(body.details).toBeDefined();
    });

    it("should return 201 and persist a new question record on valid schema parameters", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { email: "admin@toeicmaster.vn", role: "ADMIN" },
      });

      const validPayload = {
        text: "The supervisor requested that all weekly reports be completed _____.",
        optionA: "promptly",
        optionB: "prompt",
        optionC: "promptness",
        optionD: "prompter",
        correctAnswer: "A",
        explanationVi: "Cần trạng từ bổ nghĩa cho động từ completed.",
        part: 5,
        subSkillTag: "adverbs",
        difficulty: "easy",
      };

      vi.mocked(prisma.question.create).mockResolvedValueOnce({
        id: "new-q-uuid",
        ...validPayload,
        audioUrl: null,
        imageUrl: null,
        questionGroupId: null,
        testSetId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const req = new NextRequest("http://localhost:3000/api/admin/questions", {
        method: "POST",
        body: JSON.stringify(validPayload),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.message).toContain("Tạo câu hỏi thành công");
      expect(body.question.id).toBe("new-q-uuid");
      expect(prisma.question.create).toHaveBeenCalled();
    });
  });

  describe("PATCH /api/admin/questions/[id]", () => {
    it("should pre-load details on GET successfully", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { email: "admin@toeicmaster.vn", role: "ADMIN" },
      });

      vi.mocked(prisma.question.findUnique).mockResolvedValueOnce({
        id: "q-uuid-2",
        text: "Incomplete Sentence",
        part: 5,
        difficulty: "easy",
        subSkillTag: "nouns",
        correctAnswer: "B",
      } as any);

      const req = new NextRequest("http://localhost:3000/api/admin/questions/q-uuid-2");
      const res = await GET_BY_ID(req, { params: { id: "q-uuid-2" } });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.question.id).toBe("q-uuid-2");
    });

    it("should update question parameters and return 200 on PATCH", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { email: "admin@toeicmaster.vn", role: "ADMIN" },
      });

      vi.mocked(prisma.question.findUnique).mockResolvedValueOnce({ id: "q-uuid-2" } as any);
      vi.mocked(prisma.question.update).mockResolvedValueOnce({
        id: "q-uuid-2",
        text: "Updated text prompt",
      } as any);

      const editPayload = {
        text: "Updated text prompt",
        optionA: "A",
        optionB: "B",
        optionC: "C",
        optionD: "D",
        correctAnswer: "C",
        explanationVi: "New explanation",
        part: 5,
        subSkillTag: "tag",
        difficulty: "medium",
      };

      const req = new NextRequest("http://localhost:3000/api/admin/questions/q-uuid-2", {
        method: "PATCH",
        body: JSON.stringify(editPayload),
      });

      const res = await PATCH(req, { params: { id: "q-uuid-2" } });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toContain("Cập nhật câu hỏi thành công");
      expect(prisma.question.update).toHaveBeenCalled();
    });
  });

  describe("DELETE /api/admin/questions/[id]", () => {
    it("should successfully trigger deletion and delete database records", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { email: "admin@toeicmaster.vn", role: "ADMIN" },
      });

      vi.mocked(prisma.question.findUnique).mockResolvedValueOnce({ id: "q-uuid-3" } as any);
      vi.mocked(prisma.question.delete).mockResolvedValueOnce({ id: "q-uuid-3" } as any);

      const req = new NextRequest("http://localhost:3000/api/admin/questions/q-uuid-3", {
        method: "DELETE",
      });

      const res = await DELETE(req, { params: { id: "q-uuid-3" } });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toContain("Xóa câu hỏi thành công");
      expect(prisma.question.delete).toHaveBeenCalled();
    });
  });
});

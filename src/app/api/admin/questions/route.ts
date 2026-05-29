import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const questionFormSchema = z.object({
  text: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  optionA: z.string().min(1, "Lựa chọn A không được để trống"),
  optionB: z.string().min(1, "Lựa chọn B không được để trống"),
  optionC: z.string().min(1, "Lựa chọn C không được để trống"),
  optionD: z.string().min(1, "Lựa chọn D không được để trống"),
  correctAnswer: z.enum(["A", "B", "C", "D"] as const, {
    message: "Đáp án đúng phải là A, B, C hoặc D",
  }),
  explanationVi: z.string().min(1, "Lời giải thích không được để trống"),
  part: z.number().int().min(1).max(7, "Phần thi phải từ 1 đến 7"),
  subSkillTag: z.string().min(1, "Tag chủ đề không được để trống"),
  difficulty: z.enum(["easy", "medium", "hard"] as const, {
    message: "Độ khó phải là easy, medium hoặc hard",
  }),
  audioUrl: z.string().nullable().optional().or(z.literal("")),
  imageUrl: z.string().nullable().optional().or(z.literal("")),
  questionGroupId: z.string().nullable().optional().or(z.literal("")),
  testSetId: z.string().nullable().optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "403 Forbidden - Bạn không có quyền truy cập." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const partParam = searchParams.get("part");
    const difficultyParam = searchParams.get("difficulty");
    const tagParam = searchParams.get("subSkillTag");
    const query = searchParams.get("query") || "";

    const where: any = {};

    if (partParam) {
      const partVal = parseInt(partParam, 10);
      if (!isNaN(partVal)) {
        where.part = partVal;
      }
    }
    if (difficultyParam) {
      where.difficulty = difficultyParam;
    }
    if (tagParam) {
      where.subSkillTag = { contains: tagParam, mode: "insensitive" };
    }
    if (query) {
      where.text = { contains: query, mode: "insensitive" };
    }

    const [total, questions] = await prisma.$transaction([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          questionGroup: true,
        },
      }),
    ]);

    return NextResponse.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      questions,
    });
  } catch (error) {
    console.error("GET /api/admin/questions error:", error);
    return NextResponse.json(
      { error: "500 Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "403 Forbidden - Bạn không có quyền truy cập." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = questionFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "400 Bad Request", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    const question = await prisma.question.create({
      data: {
        text: data.text,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correctAnswer: data.correctAnswer,
        explanationVi: data.explanationVi,
        part: data.part,
        subSkillTag: data.subSkillTag,
        difficulty: data.difficulty,
        audioUrl: data.audioUrl || null,
        imageUrl: data.imageUrl || null,
        questionGroupId: data.questionGroupId || null,
        testSetId: data.testSetId || null,
      },
    });

    return NextResponse.json({ message: "Tạo câu hỏi thành công!", question }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/questions error:", error);
    return NextResponse.json(
      { error: "500 Internal Server Error" },
      { status: 500 }
    );
  }
}

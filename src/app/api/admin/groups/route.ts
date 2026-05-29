import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

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
    const partParam = searchParams.get("part");
    const part = partParam ? parseInt(partParam, 10) : undefined;

    const groups = await prisma.questionGroup.findMany({
      where: part !== undefined && !isNaN(part) ? { part } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("GET /api/admin/groups error:", error);
    return NextResponse.json(
      { error: "500 Internal Server Error" },
      { status: 500 }
    );
  }
}

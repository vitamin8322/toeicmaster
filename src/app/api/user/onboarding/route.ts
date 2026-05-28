import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "401 Unauthorized - Vui lòng đăng nhập để thực hiện." },
        { status: 401 }
      );
    }

    // 2. Parse and validate payload
    const body = await req.json();
    const { targetScore } = body;

    const validScores = [450, 550, 650, 750, 850];
    if (typeof targetScore !== "number" || !validScores.includes(targetScore)) {
      return NextResponse.json(
        { error: "400 Bad Request - Điểm mục tiêu không hợp lệ. Vui lòng chọn 450, 550, 650, 750 hoặc 850." },
        { status: 400 }
      );
    }

    // 3. Update learner profile in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        targetScore,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({
      message: "Cấu hình mục tiêu điểm số thành công!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        targetScore: updatedUser.targetScore,
        onboardingCompleted: updatedUser.onboardingCompleted,
      },
    });
  } catch (error: any) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json(
      { error: "500 Internal Server Error - Đã xảy ra lỗi trên hệ thống." },
      { status: 500 }
    );
  }
}

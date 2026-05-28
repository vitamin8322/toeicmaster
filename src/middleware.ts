import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Enforce Admin role restriction
    if (isAdminRoute && token?.role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "403 Forbidden - Bạn không có quyền truy cập quản trị." }),
        { status: 403, headers: { "content-type": "application/json" } }
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isAdminRoute = path.startsWith("/admin");
    const isOnboardingRoute = path === "/onboarding";

    // 1. Enforce Admin role restriction
    if (isAdminRoute && token?.role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "403 Forbidden - Bạn không có quyền truy cập quản trị." }),
        { status: 403, headers: { "content-type": "application/json" } }
      );
    }

    // 2. Enforce Onboarding routing rules for standard learners
    if (token && token.role !== "ADMIN") {
      // @ts-ignore
      const onboarded = token.onboardingCompleted;

      if (!onboarded && !isOnboardingRoute) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }

      if (onboarded && isOnboardingRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
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
  matcher: ["/dashboard/:path*", "/admin/:path*", "/onboarding"],
};

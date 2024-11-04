import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ["/auth/signin", "/auth/signup"];
  const isPublicPath = publicPaths.includes(path);

  if (!session && !isPublicPath) {
    // Redirect to signin if trying to access a protected route without auth
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (session && isPublicPath) {
    // Redirect to dashboard if trying to access auth pages while logged in
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

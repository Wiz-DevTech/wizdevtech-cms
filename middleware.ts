import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: NextRequest) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Public routes that don't require authentication
  const publicRoutes = [
    "/auth/signin",
    "/auth/signup", 
    "/auth/error",
    "/api/auth",
    "/api/health",
    "/api/demo",
    "/preview",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
  ]

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If user is not authenticated and trying to access protected route
  if (!session && !isPublicRoute) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If user is authenticated and trying to access auth routes
  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Role-based access control for specific routes
  if (session) {
    const userRole = session.user.role
    const userPermissions = session.user.permissions

    // Admin-only routes
    const adminRoutes = [
      "/admin",
      "/api/admin",
      "/api/users",
      "/api/roles",
      "/api/settings",
    ]

    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
    if (isAdminRoute && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // Editor routes (require editor permission)
    const editorRoutes = [
      "/editor",
      "/api/content",
      "/api/media",
    ]

    const isEditorRoute = editorRoutes.some(route => pathname.startsWith(route))
    if (isEditorRoute && !userPermissions.includes("content:edit")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
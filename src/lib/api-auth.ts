import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function withAuth(
  handler: (request: Request, context: { user: any }) => Promise<Response>,
  options?: {
    requiredPermission?: string
    requiredRole?: string
    requiredAnyPermission?: string[]
  }
) {
  return async (request: Request, context?: any) => {
    try {
      const session = await auth()
      
      if (!session?.user) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }

      // Check role requirements
      if (options?.requiredRole && session.user.role !== options.requiredRole) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        )
      }

      // Check permission requirements
      if (options?.requiredPermission && 
          !session.user.permissions.includes(options.requiredPermission)) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        )
      }

      // Check any permission requirements
      if (options?.requiredAnyPermission) {
        const hasPermission = options.requiredAnyPermission.some(permission =>
          session.user.permissions.includes(permission)
        )
        if (!hasPermission) {
          return NextResponse.json(
            { error: "Insufficient permissions" },
            { status: 403 }
          )
        }
      }

      return await handler(request, { user: session.user })
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export function requirePermission(permission: string) {
  return withAuth((request, { user }) => {
    if (!user.permissions.includes(permission)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }
    return NextResponse.json({ authorized: true })
  }, { requiredPermission: permission })
}

export function requireRole(role: string) {
  return withAuth((request, { user }) => {
    if (user.role !== role) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }
    return NextResponse.json({ authorized: true })
  }, { requiredRole: role })
}
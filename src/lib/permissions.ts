import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/signin")
  }
  return user
}

export async function requireRole(role: string) {
  const user = await requireAuth()
  if (user.role !== role) {
    redirect("/unauthorized")
  }
  return user
}

export async function requirePermission(permission: string) {
  const user = await requireAuth()
  if (!user.permissions.includes(permission)) {
    redirect("/unauthorized")
  }
  return user
}

export async function requireAnyPermission(permissions: string[]) {
  const user = await requireAuth()
  const hasPermission = permissions.some(permission => 
    user.permissions.includes(permission)
  )
  if (!hasPermission) {
    redirect("/unauthorized")
  }
  return user
}

export function hasPermission(user: any, permission: string): boolean {
  return user?.permissions?.includes(permission) || false
}

export function hasRole(user: any, role: string): boolean {
  return user?.role === role
}

export function isAdmin(user: any): boolean {
  return hasRole(user, "admin")
}

export function isEditor(user: any): boolean {
  return hasPermission(user, "content:edit") || isAdmin(user)
}

export function canViewContent(user: any): boolean {
  return hasPermission(user, "content:view") || isAdmin(user) || isEditor(user)
}

export function canEditContent(user: any): boolean {
  return hasPermission(user, "content:edit") || isAdmin(user)
}

export function canDeleteContent(user: any): boolean {
  return hasPermission(user, "content:delete") || isAdmin(user)
}

export function canManageUsers(user: any): boolean {
  return hasPermission(user, "users:manage") || isAdmin(user)
}

export function canViewAnalytics(user: any): boolean {
  return hasPermission(user, "analytics:view") || isAdmin(user) || isEditor(user)
}
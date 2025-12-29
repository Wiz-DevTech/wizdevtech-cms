"use client"

import { useSession as useNextAuthSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAuth() {
  const { data: session, status, update, signIn, signOut } = useNextAuthSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const user = session?.user
  const isAuthenticated = status === "authenticated"
  const isPending = status === "loading"

  const refreshSession = async () => {
    setIsLoading(true)
    try {
      await update()
    } catch (error) {
      console.error("Failed to refresh session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signOutWithRedirect = async (callbackUrl?: string) => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: callbackUrl || "/auth/signin" })
    } catch (error) {
      console.error("Failed to sign out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const requireAuth = () => {
    if (!isAuthenticated && !isPending) {
      router.push("/auth/signin")
      return false
    }
    return isAuthenticated
  }

  const requireRole = (role: string) => {
    if (!requireAuth()) return false
    
    if (user?.role !== role) {
      router.push("/unauthorized")
      return false
    }
    return true
  }

  const requirePermission = (permission: string) => {
    if (!requireAuth()) return false
    
    if (!user?.permissions?.includes(permission)) {
      router.push("/unauthorized")
      return false
    }
    return true
  }

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false
  }

  const hasRole = (role: string) => {
    return user?.role === role
  }

  const isAdmin = () => hasRole("admin")
  const isEditor = () => hasPermission("content:edit") || isAdmin()
  const isAuthor = () => hasPermission("content:create") || isEditor()
  const isViewer = () => hasPermission("content:view") || isAuthor()

  return {
    user,
    session,
    status,
    isAuthenticated,
    isPending,
    isLoading,
    refreshSession,
    signOut: signOutWithRedirect,
    requireAuth,
    requireRole,
    requirePermission,
    hasPermission,
    hasRole,
    isAdmin,
    isEditor,
    isAuthor,
    isViewer,
  }
}
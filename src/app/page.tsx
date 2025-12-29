"use client";

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SimpleLayout } from "@/components/layout/SimpleLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading 5CMS...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  const user = {
    name: session.user.name || "Unknown User",
    email: session.user.email || "",
    role: session.user.role || "Unknown",
    permissions: session.user.permissions || []
  }

  return (
    <SimpleLayout user={user}>
      <Dashboard user={user} />
    </SimpleLayout>
  )
}
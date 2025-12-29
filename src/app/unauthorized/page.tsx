"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX, LogOut } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
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
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this resource
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Your current role is <strong>{session.user.role}</strong>. 
              This page requires additional permissions.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Your permissions:</strong></p>
            <ul className="mt-1 list-disc list-inside">
              {session.user.permissions.length > 0 ? (
                session.user.permissions.map((permission) => (
                  <li key={permission}>{permission}</li>
                ))
              ) : (
                <li>No permissions assigned</li>
              )}
            </ul>
          </div>
        </CardContent>
        
        <div className="flex flex-col gap-2 px-6 pb-6">
          <Button onClick={() => router.back()} variant="outline" className="w-full">
            Go Back
          </Button>
          
          <Button asChild className="w-full">
            <Link href="/">Go to Dashboard</Link>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => router.push("/api/auth/signout")}
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  )
}
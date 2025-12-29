"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  const router = useRouter()
  const error = router.query?.error as string

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "CredentialsSignin":
        return "Invalid credentials. Please check your email and password."
      case "AccessDenied":
        return "Access denied. You don't have permission to access this resource."
      case "Verification":
        return "Please verify your email address before signing in."
      case "Default":
        return "An error occurred during authentication."
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
      case "OAuthAccountNotLinked":
      case "SessionRequired":
        return "An authentication error occurred. Please try again."
      default:
        return "An unknown error occurred. Please try again."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Authentication Error
          </CardTitle>
          <CardDescription>
            There was a problem signing you in
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              {getErrorMessage(error || "Default")}
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={() => router.push("/auth/signin")} className="w-full">
            Try Again
          </Button>
          
          <div className="text-sm text-center space-y-2">
            <p>
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
            <Link href="/auth/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
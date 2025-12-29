import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: "No active session" },
        { status: 401 }
      )
    }

    // Update last login time
    // In a real app, you might want to update the user's lastLoginAt in the database
    
    return NextResponse.json({
      success: true,
      data: {
        user: session.user,
        expires: session.expires,
        refreshed: true,
      }
    })
  } catch (error) {
    console.error("Session refresh error:", error)
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    )
  }
}
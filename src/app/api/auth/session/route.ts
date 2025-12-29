import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: "No active session" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: session.user,
        expires: session.expires,
      }
    })
  } catch (error) {
    console.error("Session fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}
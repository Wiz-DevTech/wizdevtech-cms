import { NextRequest, NextResponse } from "next/server"
import { generateCSRFToken } from "@/lib/csrf"

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id')
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 401 }
      )
    }
    
    const token = generateCSRFToken(sessionId)
    
    return NextResponse.json({
      csrfToken: token
    })
  } catch (error) {
    console.error("CSRF token generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 }
    )
  }
}
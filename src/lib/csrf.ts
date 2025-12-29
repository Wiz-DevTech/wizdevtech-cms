import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"

// In-memory store for CSRF tokens (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>()

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (data.expires < now) {
      csrfTokens.delete(sessionId)
    }
  }
}, 5 * 60 * 1000)

export function generateCSRFToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex')
  const expires = Date.now() + (60 * 60 * 1000) // 1 hour
  
  csrfTokens.set(sessionId, { token, expires })
  return token
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const storedData = csrfTokens.get(sessionId)
  
  if (!storedData) {
    return false
  }
  
  if (storedData.expires < Date.now()) {
    csrfTokens.delete(sessionId)
    return false
  }
  
  if (storedData.token !== token) {
    return false
  }
  
  // Remove token after successful validation (one-time use)
  csrfTokens.delete(sessionId)
  return true
}

export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  // Check header first
  const headerToken = request.headers.get('x-csrf-token')
  if (headerToken) {
    return headerToken
  }
  
  // Check body for form submissions
  try {
    const contentType = request.headers.get('content-type')
    if (contentType?.includes('application/x-www-form-urlencoded') || 
        contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      return formData.get('csrf_token') as string
    }
  } catch {
    // If parsing fails, continue
  }
  
  return null
}

export function withCSRFProtection(
  handler: (request: NextRequest, context: any) => Promise<Response>
) {
  return async (request: NextRequest, context: any) => {
    const sessionId = request.headers.get('x-session-id')
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 401 }
      )
    }
    
    // For GET requests, generate and return CSRF token
    if (request.method === 'GET') {
      const token = generateCSRFToken(sessionId)
      return NextResponse.json({
        csrfToken: token
      })
    }
    
    // For state-changing requests, validate CSRF token
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const csrfToken = getCSRFTokenFromRequest(request)
      
      if (!csrfToken) {
        return NextResponse.json(
          { error: "CSRF token required" },
          { status: 403 }
        )
      }
      
      if (!validateCSRFToken(sessionId, csrfToken)) {
        return NextResponse.json(
          { error: "Invalid CSRF token" },
          { status: 403 }
        )
      }
    }
    
    return await handler(request, context)
  }
}
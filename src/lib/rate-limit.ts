import { NextRequest, NextResponse } from "next/server"

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  windowMs?: number // Time window in milliseconds
  max?: number // Max requests per window
  identifier?: string // Custom identifier (default: IP address)
  message?: string // Custom error message
}

export function createRateLimit(options: RateLimitOptions = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // 100 requests per window
    identifier,
    message = "Too many requests, please try again later."
  } = options

  return function rateLimit(
    handler: (request: NextRequest, context: any) => Promise<Response>
  ) {
    return async (request: NextRequest, context: any) => {
      // Get identifier
      let key: string
      if (identifier) {
        key = identifier
      } else {
        // Use IP address as default identifier
        const forwarded = request.headers.get('x-forwarded-for')
        const realIp = request.headers.get('x-real-ip')
        const ip = forwarded?.split(',')[0] || realIp || 'unknown'
        key = `ip:${ip}`
      }

      const now = Date.now()
      const windowStart = now - windowMs

      // Get current rate limit data
      let rateLimitData = rateLimitStore.get(key)
      
      if (!rateLimitData || rateLimitData.resetTime < now) {
        // Reset or create new rate limit data
        rateLimitData = {
          count: 1,
          resetTime: now + windowMs
        }
      } else {
        // Increment count
        rateLimitData.count++
      }

      // Store updated data
      rateLimitStore.set(key, rateLimitData)

      // Set rate limit headers
      const headers = {
        'X-RateLimit-Limit': max.toString(),
        'X-RateLimit-Remaining': Math.max(0, max - rateLimitData.count).toString(),
        'X-RateLimit-Reset': new Date(rateLimitData.resetTime).toISOString(),
      }

      // Check if rate limit exceeded
      if (rateLimitData.count > max) {
        return NextResponse.json(
          { 
            error: message,
            retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000)
          },
          { 
            status: 429,
            headers: {
              ...headers,
              'Retry-After': Math.ceil((rateLimitData.resetTime - now) / 1000).toString()
            }
          }
        )
      }

      // Execute handler with rate limit headers
      const response = await handler(request, context)
      
      // Add rate limit headers to response
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    }
  }
}

// Predefined rate limits for different use cases
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: "Too many authentication attempts, please try again later."
})

export const contentRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: "Too many content requests, please try again later."
})

export const uploadRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 uploads per minute
  message: "Too many upload attempts, please try again later."
})

export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: "API rate limit exceeded, please try again later."
})
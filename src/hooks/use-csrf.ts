"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function useCSRFToken() {
  const { data: session } = useSession()
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchCSRFToken = async () => {
    if (!session?.user) return null
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        headers: {
          'x-session-id': session.user.id,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setCsrfToken(data.csrfToken)
        return data.csrfToken
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error)
    } finally {
      setIsLoading(false)
    }
    
    return null
  }

  useEffect(() => {
    if (session?.user) {
      fetchCSRFToken()
    }
  }, [session])

  const addCSRFToRequest = async (url: string, options: RequestInit = {}) => {
    if (!csrfToken) {
      await fetchCSRFToken()
    }
    
    const headers = {
      ...options.headers,
      'x-csrf-token': csrfToken || '',
      'x-session-id': session?.user?.id || '',
    }
    
    return fetch(url, {
      ...options,
      headers,
    })
  }

  return {
    csrfToken,
    isLoading,
    refreshCSRFToken: fetchCSRFToken,
    addCSRFToRequest,
  }
}
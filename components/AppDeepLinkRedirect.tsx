'use client'

import { useEffect } from 'react'

export default function AppDeepLinkRedirect() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      const search = window.location.search

      if (hash.includes('access_token=') || search.includes('code=')) {
        const appUrl = `io.supabase.jagacuan://login-callback${search}${hash}`
        console.log('Redirecting OAuth response to mobile app:', appUrl)
        window.location.href = appUrl
      }
    }
  }, [])

  return null
}

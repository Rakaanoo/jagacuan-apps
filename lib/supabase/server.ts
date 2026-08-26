import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const REAL_SUPABASE_URL = 'https://cddmksbflgzxmavrddrp.supabase.co'
const REAL_SUPABASE_ANON_KEY = 'sb_publishable_TVp222txq_5NUckBeMeK5g_wG5hEY1t'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || REAL_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || REAL_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // High level server component cookie setting warning ignored safely
          }
        },
      },
    }
  )
}

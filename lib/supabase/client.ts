import { createBrowserClient } from '@supabase/ssr'

const REAL_SUPABASE_URL = 'https://cddmksbflgzxmavrddrp.supabase.co'
const REAL_SUPABASE_ANON_KEY = 'sb_publishable_TVp222txq_5NUckBeMeK5g_wG5hEY1t'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || REAL_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || REAL_SUPABASE_ANON_KEY
  )
}

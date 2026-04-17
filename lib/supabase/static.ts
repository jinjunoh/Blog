// Cookie-free Supabase client for use in generateStaticParams and other
// build-time contexts where Next.js request cookies are unavailable.
import { createClient } from '@supabase/supabase-js'

export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

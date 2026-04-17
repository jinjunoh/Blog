import slugify from 'slugify'
import type { SupabaseClient } from '@supabase/supabase-js'

function baseSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true })
}

export async function generateSlug(
  title: string,
  supabase: SupabaseClient,
  excludeId?: string
): Promise<string> {
  const base = baseSlug(title) || `post-${Date.now()}`

  // Check if base slug is taken
  let query = supabase.from('posts').select('slug').eq('slug', base)
  if (excludeId) query = query.neq('id', excludeId)
  const { data } = await query.single()

  if (!data) return base

  // Try base-2, base-3, ... until available
  for (let i = 2; i <= 99; i++) {
    const candidate = `${base}-${i}`
    let q = supabase.from('posts').select('slug').eq('slug', candidate)
    if (excludeId) q = q.neq('id', excludeId)
    const { data: existing } = await q.single()
    if (!existing) return candidate
  }

  // Fallback: base + timestamp suffix
  return `${base}-${Date.now()}`
}

import type { SupabaseClient } from '@supabase/supabase-js'
import type { CreatePostInput, Post, UpdatePostInput } from '@/lib/types'
import { generateSlug } from '@/lib/utils/slug'
import { generateExcerpt } from '@/lib/utils/excerpt'

// Returns all posts (for admin — requires authenticated client)
export async function getPosts(supabase: SupabaseClient): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// Returns single post by ID (admin use)
export async function getPostById(
  supabase: SupabaseClient,
  id: string
): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// Returns a published+public post by slug (public use)
export async function getPostBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

// Returns all published+public posts (for static generation)
export async function getPublishedPosts(supabase: SupabaseClient): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('is_public', true)
    .order('published_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createPost(
  supabase: SupabaseClient,
  input: CreatePostInput
): Promise<Post> {
  const slug = await generateSlug(input.title, supabase)

  // Auto-generate excerpt if not provided and publishing
  const excerpt =
    input.excerpt?.trim() ||
    (input.status === 'published' ? generateExcerpt(input.content) : null)

  const { data, error } = await supabase
    .from('posts')
    .insert({ ...input, slug, excerpt })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePost(
  supabase: SupabaseClient,
  id: string,
  input: UpdatePostInput
): Promise<Post> {
  // Re-generate slug only if title changed
  let slug: string | undefined
  if (input.title) {
    slug = await generateSlug(input.title, supabase, id)
  }

  // Auto-generate excerpt when publishing
  const excerpt =
    input.excerpt !== undefined
      ? input.excerpt?.trim() || null
      : input.status === 'published' && input.content
      ? generateExcerpt(input.content)
      : undefined

  const payload: Record<string, unknown> = { ...input }
  if (slug) payload.slug = slug
  if (excerpt !== undefined) payload.excerpt = excerpt

  const { data, error } = await supabase
    .from('posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePost(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

export async function searchPosts(
  supabase: SupabaseClient,
  query: string
): Promise<Post[]> {
  // RLS automatically restricts to published+public for anon, all for authenticated
  const { data, error } = await supabase
    .rpc('search_posts', { query })

  if (error) throw error
  return data ?? []
}

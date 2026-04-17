import { createClient } from '@/lib/supabase/server'
import { createPost, getPosts } from '@/lib/db/posts'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    const posts = await getPosts(supabase)
    return NextResponse.json(posts)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, status, is_public } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!['draft', 'published'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = createClient()
    const post = await createPost(supabase, {
      title: title.trim(),
      content: content ?? '',
      excerpt: excerpt ?? undefined,
      status,
      is_public: Boolean(is_public),
    })

    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { createClient } from '@/lib/supabase/server'
import { deletePost, getPostById, updatePost } from '@/lib/db/posts'
import { NextRequest, NextResponse } from 'next/server'

type Params = { params: { id: string } }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const supabase = createClient()
    const post = await getPostById(supabase, params.id)
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json()
    const { title, content, excerpt, status, is_public } = body

    if (status && !['draft', 'published'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = createClient()
    const post = await updatePost(supabase, params.id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(content !== undefined && { content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(status !== undefined && { status }),
      ...(is_public !== undefined && { is_public: Boolean(is_public) }),
    })

    return NextResponse.json(post)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const supabase = createClient()
    await deletePost(supabase, params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

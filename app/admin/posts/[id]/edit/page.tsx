import { createClient } from '@/lib/supabase/server'
import { getPostById } from '@/lib/db/posts'
import PostEditor from '@/components/posts/PostEditor'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: { id: string }
}

export default async function EditPostPage({ params }: Props) {
  const supabase = createClient()
  const post = await getPostById(supabase, params.id)

  if (!post) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit post</h1>
        {post.status === 'published' && post.is_public && (
          <Link
            href={`/posts/${post.slug}`}
            target="_blank"
            className="text-sm text-gray-500 hover:text-gray-900 underline"
          >
            View live ↗
          </Link>
        )}
      </div>
      <PostEditor post={post} />
    </div>
  )
}

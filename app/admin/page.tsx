import { createClient } from '@/lib/supabase/server'
import { getPosts } from '@/lib/db/posts'
import PostCard from '@/components/posts/PostCard'
import Link from 'next/link'
import type { Post } from '@/lib/types'

export default async function AdminDashboard() {
  const supabase = createClient()
  const posts = await getPosts(supabase)

  const drafts = posts.filter((p: Post) => p.status === 'draft')
  const published = posts.filter((p: Post) => p.status === 'published')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 && (
        <p className="text-gray-400 text-sm">No posts yet. <Link href="/admin/posts/new" className="underline">Create your first post.</Link></p>
      )}

      {published.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Published ({published.length})</h2>
          {published.map((post: Post) => (
            <PostCard key={post.id} post={post} admin />
          ))}
        </section>
      )}

      {drafts.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Drafts ({drafts.length})</h2>
          {drafts.map((post: Post) => (
            <PostCard key={post.id} post={post} admin />
          ))}
        </section>
      )}
    </div>
  )
}
